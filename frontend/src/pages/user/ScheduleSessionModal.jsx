import { useState } from "react";
import { createExchangeSession } from "../../api/exchangeSessionApi";

function ScheduleSessionModal({
  exchange,
  onClose,
  onSuccess,
}) {
  const [scheduledDate, setScheduledDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [meetingPlatform, setMeetingPlatform] =
    useState("");

  const [meetingLink, setMeetingLink] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!scheduledDate) {
      setError("Please select a date.");
      return;
    }

    if (!startTime) {
      setError("Please select a start time.");
      return;
    }

    if (!endTime) {
      setError("Please select an end time.");
      return;
    }

    if (startTime >= endTime) {
      setError(
        "Start time must be before end time."
      );
      return;
    }

    if (!meetingPlatform.trim()) {
      setError(
        "Please enter the meeting platform."
      );
      return;
    }

    if (!meetingLink.trim()) {
      setError(
        "Please enter the meeting link."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        scheduledDate,
        startTime,
        endTime,
        meetingPlatform:
          meetingPlatform.trim(),
        meetingLink:
          meetingLink.trim(),
        notes: notes.trim() || null,
      };

      console.log(
        "Creating exchange session:",
        payload
      );

      const response =
        await createExchangeSession(
          exchange.id,
          payload
        );

      onSuccess?.(response);

      onClose();
    } catch (err) {
      console.error(
        "Error creating session:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to schedule session."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Schedule Session
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {exchange.skillName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-2xl text-gray-500 hover:text-gray-800"
          >
            ×
          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Date */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Session Date
            </label>

            <input
              type="date"
              min={getTodayDate()}
              value={scheduledDate}
              onChange={(event) =>
                setScheduledDate(
                  event.target.value
                )
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            />

          </div>

          {/* Time */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Time
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(event) =>
                  setStartTime(
                    event.target.value
                  )
                }
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Time
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(event) =>
                  setEndTime(
                    event.target.value
                  )
                }
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
              />

            </div>

          </div>

          {/* Meeting Platform */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Meeting Platform
            </label>

            <select
              value={meetingPlatform}
              onChange={(event) =>
                setMeetingPlatform(
                  event.target.value
                )
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            >

              <option value="">
                Select platform
              </option>

              <option value="Zoom">
                Zoom
              </option>

              <option value="Google Meet">
                Google Meet
              </option>

              <option value="Microsoft Teams">
                Microsoft Teams
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* Meeting Link */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Meeting Link
            </label>

            <input
              type="url"
              value={meetingLink}
              onChange={(event) =>
                setMeetingLink(
                  event.target.value
                )
              }
              placeholder="https://..."
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            />

          </div>

          {/* Notes */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
              <span className="ml-1 text-gray-400">
                (Optional)
              </span>
            </label>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              placeholder="Add any instructions or information for the learner..."
              rows={4}
              maxLength={1000}
              disabled={loading}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {notes.length}/1000
            </p>

          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Scheduling..."
                : "Schedule Session"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ScheduleSessionModal;