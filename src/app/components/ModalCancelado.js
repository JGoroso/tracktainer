import React from "react";

function ModalCancelado({ show, message }) {
  if (!show) return null;


  return (
  

    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center">
                
<svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-yellow-500 " fill="currentColor" aria-hidden="true" viewBox="0 0 20 20"   >
  <path fillRule="evenodd" d="M6 18 18 6M6 6l12 12" clipRule="evenodd" />
</svg>

              <div className="ml-3">
                <h3

                  className="text-base font-semibold leading-6 text-gray-900"

                  id="modal-title"
                >
                  {message}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalCancelado;
