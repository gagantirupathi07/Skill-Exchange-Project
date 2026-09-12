import { useEffect, useState } from "react";
import {
  getCreditBalance,
  getCreditTransactions,
} from "../../api/creditApi";

function Credits() {
  const [balance, setBalance] = useState(null);

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadCreditData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        balanceData,
        transactionData,
      ] = await Promise.all([
        getCreditBalance(),
        getCreditTransactions(),
      ]);

      setBalance(balanceData);

      setTransactions(
        transactionData || []
      );

    } catch (err) {
      console.error(
        "Error loading credit data:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to load credit information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreditData();
  }, []);

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "0.00";
    }

    return Number(amount).toFixed(2);
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getTransactionAmount = (
    transaction
  ) => {
    const amount =
      Number(transaction.amount) || 0;

    return transaction.type === "EARN"
      ? `+${amount.toFixed(2)}`
      : `-${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-gray-500">
            Loading your credits...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Credits
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your credit balance and view
          your complete transaction history.
        </p>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* =========================
          BALANCE CARD
      ========================= */}

      <div className="mb-10 overflow-hidden rounded-2xl bg-white shadow-sm">

        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 px-6 py-10 text-white">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-medium uppercase tracking-wider text-blue-100">
              Available Credit Balance
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">

              <span className="text-5xl font-bold tracking-tight">
                {formatAmount(
                  balance?.balance
                )}
              </span>

            </div>

            <p className="mt-2 text-sm text-blue-100">
              Skill Exchange Credits
            </p>

          </div>

        </div>


        {/* Wallet Information */}

        <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          <div className="p-5 text-center">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Username
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              {balance?.username || "—"}
            </p>

          </div>


          <div className="p-5 text-center">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              User ID
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              #{balance?.userId || "—"}
            </p>

          </div>


          <div className="p-5 text-center">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Wallet ID
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              #{balance?.walletId || "—"}
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          HISTORY HEADER
      ========================= */}

      <div className="mb-4">

        <h2 className="text-2xl font-bold text-gray-900">
          Credit History
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your recent credit earnings and spending.
        </p>

      </div>


      {/* =========================
          EMPTY HISTORY
      ========================= */}

      {transactions.length === 0 ? (

        <div className="rounded-xl bg-white p-12 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

            <span className="text-2xl">
              C
            </span>

          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            No transactions yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Your credit transactions will appear
            here when you earn or spend credits.
          </p>

        </div>

      ) : (

        /* =========================
           TRANSACTION LIST
        ========================= */

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          {transactions.map(
            (transaction, index) => (

              <div
                key={transaction.id}
                className={`p-5 transition hover:bg-gray-50 ${
                  index !==
                  transactions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* Left */}

                  <div className="flex min-w-0 items-start gap-4">

                    {/* Transaction Icon */}

                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
                        transaction.type ===
                        "EARN"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >

                      <span
                        className={`text-lg font-bold ${
                          transaction.type ===
                          "EARN"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type ===
                        "EARN"
                          ? "+"
                          : "−"}
                      </span>

                    </div>


                    {/* Transaction Details */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-gray-900">
                          {transaction.type ===
                          "EARN"
                            ? "Credits Earned"
                            : "Credits Spent"}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            transaction.type ===
                            "EARN"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.type}
                        </span>

                      </div>


                      <p className="mt-1 break-words text-sm text-gray-600">
                        {transaction.description ||
                          "Credit transaction"}
                      </p>


                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">

                        <span>
                          Exchange #
                          {transaction.exchangeId}
                        </span>

                        <span>
                          {formatDateTime(
                            transaction.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Right */}

                  <div className="flex flex-row items-center justify-between gap-8 sm:flex-col sm:items-end sm:gap-1">

                    <p
                      className={`text-xl font-bold ${
                        transaction.type ===
                        "EARN"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {getTransactionAmount(
                        transaction
                      )}
                    </p>

                    <p className="text-xs text-gray-500">
                      Balance:{" "}
                      <span className="font-semibold text-gray-700">
                        {formatAmount(
                          transaction.balanceAfter
                        )}
                      </span>
                    </p>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Credits;