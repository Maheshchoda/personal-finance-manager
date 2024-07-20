import { db } from "@/drizzle";
import { account, category, transaction } from "@/drizzle/schema";
import { calculatePercentageChange } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gte, gt, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

// Constants
const DATE_FORMAT = "yyyy-MM-dd";
const DAYS_IN_PERIOD = 30;

const app = new Hono();

app.get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    }),
  ),
  async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const { accountId, from, to } = c.req.valid("query");
      const {
        startDate,
        endDate,
        previousPeriodStartDate,
        previousPeriodEndDate,
      } = getDateRanges(from, to);

      const [currentPeriodData] = (await fetchFinancialData({
        fetch: "spentOverview",
        accountId,
        userId: auth.userId,
        startDate,
        endDate,
      })) as FinanceOverviewType[];
      const [previousPeriodData] = (await fetchFinancialData({
        fetch: "spentOverview",
        accountId,
        userId: auth.userId,
        startDate: previousPeriodStartDate,
        endDate: previousPeriodEndDate,
      })) as FinanceOverviewType[];
      const activeDays = (await fetchFinancialData({
        fetch: "activeDays",
        accountId,
        userId: auth.userId,
        startDate: previousPeriodStartDate,
        endDate: previousPeriodEndDate,
      })) as ActiveDaysType[];

      const changePercentage = calculateChangePercentage(
        currentPeriodData,
        previousPeriodData,
      );
      const categorySpendingData = await fetchCategorySpending({
        userId: auth.userId,
        accountId,
        startDate,
        endDate,
      });

      const response = createResponse(
        currentPeriodData,
        previousPeriodData,
        changePercentage,
        categorySpendingData,
        activeDays,
      );
      return c.json(response);
    } catch (error) {
      console.error("Error fetching Transaction Summary:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },
);

// Helper Functions
function getDateRanges(from?: string, to?: string) {
  const currentDate = new Date();
  const thirtyDaysAgo = subDays(currentDate, DAYS_IN_PERIOD);

  const startDate = from ? parse(from, DATE_FORMAT, new Date()) : thirtyDaysAgo;
  const endDate = to ? parse(to, DATE_FORMAT, new Date()) : currentDate;

  const periodLength = differenceInDays(endDate, startDate) + 1;
  const previousPeriodStartDate = subDays(startDate, periodLength);
  const previousPeriodEndDate = subDays(endDate, periodLength);

  return { startDate, endDate, previousPeriodStartDate, previousPeriodEndDate };
}

function calculateChangePercentage(
  current: FinanceOverviewType,
  previous: FinanceOverviewType,
) {
  return {
    income: calculatePercentageChange(current.income, previous.income),
    expenses: calculatePercentageChange(current.expenses, previous.expenses),
    balance: calculatePercentageChange(current.balance, previous.balance),
  } as FinanceOverviewType;
}

function createResponse(
  currentPeriodData: FinanceOverviewType,
  previousPeriodData: FinanceOverviewType,
  changePercentage: FinanceOverviewType,
  categorySpendingData: {
    name: string;
    totalSpent: number;
  }[],
  activeDays: ActiveDaysType[],
) {
  const topSpendingCategories = categorySpendingData.slice(0, 3);
  const otherCategoriesSum = categorySpendingData
    .slice(3)
    .reduce((sum, current) => sum + current.totalSpent, 0);

  if (otherCategoriesSum > 0) {
    topSpendingCategories.push({
      name: "other",
      totalSpent: otherCategoriesSum,
    });
  }

  return {
    currentPeriodData,
    previousPeriodData,
    changePercentage,
    topCategories: topSpendingCategories,
    activeDays,
  };
}

type fetchType = "activeDays" | "spentOverview";

type FinanceOverviewType = {
  balance: number;
  income: number;
  expenses: number;
};
type ActiveDaysType = { date: Date; income: number; expenses: number };

interface FetchDataParams {
  userId: string;
  accountId?: string;
  startDate: Date;
  endDate: Date;
}

interface fetchFinancialDataParams extends FetchDataParams {
  fetch: fetchType;
}

async function fetchFinancialData({
  userId,
  accountId,
  startDate,
  endDate,
  fetch,
}: fetchFinancialDataParams) {
  const incomeQuery =
    sql`SUM(CASE WHEN ${transaction.amount} > 0 THEN ${transaction.amount} ELSE 0 END)`.mapWith(
      Number,
    );
  const expensesQuery =
    sql`SUM(CASE WHEN ${transaction.amount} < 0 THEN ${transaction.amount} ELSE 0 END)`.mapWith(
      Number,
    );
  const balanceQuery = sum(transaction.amount).mapWith(Number);

  const selectElements = { income: incomeQuery, expenses: expensesQuery };
  const selectedFields =
    fetch === "spentOverview"
      ? { ...selectElements, balance: balanceQuery }
      : { ...selectElements, date: transaction.date };

  let query = db
    .select(selectedFields)
    .from(transaction)
    .innerJoin(account, eq(transaction.accountId, account.id))
    .where(
      and(
        accountId ? eq(transaction.accountId, accountId) : undefined,
        eq(account.userId, userId),
        gte(transaction.date, startDate),
        lte(transaction.date, endDate),
      ),
    );

  if (fetch === "activeDays") {
    query.groupBy(transaction.date).orderBy(transaction.date);
  }

  return query;
}

async function fetchCategorySpending({
  userId,
  accountId,
  startDate,
  endDate,
}: FetchDataParams) {
  const totalSpentQuery = sql`SUM(ABS(${transaction.amount}))`.mapWith(Number);

  return db
    .select({
      name: category.name,
      totalSpent: totalSpentQuery,
    })
    .from(transaction)
    .innerJoin(account, eq(transaction.accountId, account.id))
    .innerJoin(category, eq(transaction.categoryId, category.id))
    .where(
      and(
        accountId ? eq(transaction.accountId, accountId) : undefined,
        eq(account.userId, userId),
        gte(transaction.date, startDate),
        lte(transaction.date, endDate),
        gt(transaction.amount, 0),
      ),
    )
    .groupBy(category.name)
    .orderBy(desc(totalSpentQuery));
}

export default app;
