import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

const History: React.FC = () => {
  return (
    <div className="flex-col items-center justify-between py-5 px-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-medium">History</span>
        <button
          type="button"
          className="btn btn-sm btn-outline btn-error"
          onClick={() =>
            (
              document.getElementById("clearAllModal") as HTMLDialogElement
            ).showModal()
          }
        >
          Clear All
        </button>
      </div>

      {/* Clear All Modal */}
      <dialog id="clearAllModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete all history? This action cannot be
              undone.
            </p>
            <div className="modal-action">
              <button className="btn btn-sm btn-outline btn-error">
                Delete All
              </button>
              <button className="btn btn-sm">Cancel</button>
            </div>
          </form>
        </div>
      </dialog>

      {/* History List */}
      <div className="mt-6">
        <ul className="list-none space-y-3">
          {[1, 2].map((id) => (
            <li
              key={id}
              className="flex items-center justify-between bg-base-200 p-3 rounded-lg"
            >
              {/* Text */}
              <div className="flex items-center space-x-2">
                <div className="text-4xl font-thin opacity-30 tabular-nums">
                  {id}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-success">
                    Summarized Text
                  </h4>
                  <p className="text-sm">Summary details go here...</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                <button
                  type="button"
                  className="btn btn-xs sm:btn-sm btn-outline btn-info"
                  onClick={() =>
                    (
                      document.getElementById(
                        `detailModal-${id}`
                      ) as HTMLDialogElement
                    ).showModal()
                  }
                >
                  Details
                </button>
                <button
                  type="button"
                  className="btn btn-xs sm:btn-sm btn-outline btn-primary"
                >
                  <FontAwesomeIcon icon={faCopy} className="text-sm" />
                </button>
                <button
                  type="button"
                  className="btn btn-xs sm:btn-sm btn-outline btn-success"
                >
                  <FontAwesomeIcon icon={faDownload} className="text-sm" />
                </button>
                <button
                  type="button"
                  className="btn btn-xs sm:btn-sm btn-outline btn-error"
                  onClick={() =>
                    (
                      document.getElementById(
                        `deleteModal-${id}`
                      ) as HTMLDialogElement
                    ).showModal()
                  }
                >
                  <FontAwesomeIcon icon={faTrashCan} className="text-sm" />
                </button>
              </div>

              {/* Detail Modal */}
              <dialog id={`detailModal-${id}`} className="modal">
                <div className="modal-box w-full max-w-4xl mx-4">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                    <h3 className="font-bold text-success text-lg mb-4">
                      Detail
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-md mb-2">
                          Original Text
                        </h4>
                        <p className="text-sm bg-base-200 p-2 rounded-lg">
                          Original text goes here...
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-md mb-2">
                          Summarized Result
                        </h4>
                        <p className="text-sm bg-base-200 p-2 rounded-lg">
                          Summarized result goes here...
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </dialog>

              {/* Delete Modal */}
              <dialog id={`deleteModal-${id}`} className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                    <h3 className="font-bold text-lg">Confirm Deletion</h3>
                    <p className="py-4">
                      Are you sure you want to delete this item? This action
                      cannot be undone.
                    </p>
                    <div className="modal-action">
                      <button className="btn btn-sm btn-outline btn-error">
                        Delete
                      </button>
                      <button className="btn btn-sm">Cancel</button>
                    </div>
                  </form>
                </div>
              </dialog>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default History;
