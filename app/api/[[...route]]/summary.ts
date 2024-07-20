import { db } from "@/drizzle";
import { account, category, transaction } from "@/drizzle/schema";
import { calculatePercentageChange } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gte, gt, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { start } from "repl";
import { z } from "zod";

const app = new Hono().get(
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

      const currentDate = new Date();
      const thirtyDaysAgo = subDays(currentDate, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : thirtyDaysAgo;

      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : currentDate;

      const currentPeriodLength = differenceInDays(endDate, startDate) + 1;
      const previousPeriodStartDate = subDays(startDate, currentPeriodLength);
      const previousPeriodEndDate = subDays(endDate, currentPeriodLength);

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

      const changePercentage = {
        income: calculatePercentageChange(
          currentPeriodData.income,
          previousPeriodData.income,
        ),
        expenses: calculatePercentageChange(
          currentPeriodData.expenses,
          previousPeriodData.expenses,
        ),
        balance: calculatePercentageChange(
          currentPeriodData.balance,
          previousPeriodData.balance,
        ),
      } as FinanceOverviewType;

      const categorySpendingData = await fetchCategorySpending({
        userId: auth.userId,
        accountId,
        startDate,
        endDate,
      });

      const topSpendingCategories = categorySpendingData.slice(0, 3);
      const otherCategoriesSum = categorySpendingData
        .slice(3)
        .reduce((sum, current) => sum + current.totalSpent, 0);

      if (otherCategoriesSum > 0)
        topSpendingCategories.push({
          name: "other",
          totalSpent: otherCategoriesSum,
        });
      return c.json({
        currentPeriodData,
        previousPeriodData,
        changePercentage,
        topCategories: topSpendingCategories,
        activeDays,
      });
    } catch (error) {
      console.error("Error fetching Transaction Summary:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  },
);

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

interface fetchFinancialData extends FetchDataParams {
  fetch: fetchType;
}

function fetchFinancialData({
  userId,
  accountId,
  startDate,
  endDate,
  fetch,
}: fetchFinancialData) {
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

  if (fetch === "spentOverview") {
    query.groupBy(transaction.date).orderBy(transaction.date);
  }
  return query;
}

function fetchCategorySpending({
  userId,
  accountId,
  startDate,
  endDate,
}: FetchDataParams) {
  const totalSpentQuery = sql`
      SUM(ABS(${transaction.amount}))
    `.mapWith(Number);

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
