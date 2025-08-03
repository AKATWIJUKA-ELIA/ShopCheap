import React, {  useEffect, useState } from 'react';
import { BiX } from 'react-icons/bi';
import useQualifyUser from '@/hooks/useQualifyUser';
import { useAppSelector } from '@/hooks';
import { Id } from '../../../convex/_generated/dataModel';
import { Button } from '../ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface QualifyUserProps {
  isvisible: boolean;
  onClose: () => void;
}

const QualifyUser: React.FC<QualifyUserProps> = ({ isvisible, onClose,  }) => {
    const User = useAppSelector(state => state.user.user);
    const [info, setInfo] = useState("");
    const [title, setTitle] = useState("");
    const [success, setSuccess] = useState(true);
    const { qualifyUser } = useQualifyUser();

    useEffect(() => {
        const checkQualification = async () => {
            if (!User?.User_id ||User.User_id.length===0 || !isvisible) return;
            try {
                const result = await qualifyUser(User.User_id as Id<"customers">);
                if (result.success) {
                    setInfo(result.message);
                    setSuccess(true);
                    setTitle("Success");
                } else {
                    setInfo(result.message || "An error occurred while qualifying the user.");
                    setSuccess(false);
                    setTitle("Error");
                }
            } catch {
                setInfo("An error occurred while qualifying the user.");
                setSuccess(false);
                setTitle("Error");
            }
        };
        
        checkQualification();
    }, [User?.User_id, isvisible, qualifyUser]);

    if (!isvisible) return null;

  return (
      <>
         <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out dark:bg-gray-900"
          onMouseLeave={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close modal"
            >
              <BiX className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="flex flex-col items-center text-center">
              
                                <div className={`mb-4 rounded-full p-3 ${
                                        success
                                            ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                            : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                    }`}>
                                        {success ? <CheckCircle className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
                                    </div>
                                    
                                    <div className={`text-base font-medium ${
                                        success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                                    }`}>
                                        {info}
                                    </div>
                              
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose} className="min-w-[80px] bg-transparent">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
      
  );
};

export default QualifyUser;