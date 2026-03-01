import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FileText, Upload, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentUpload = () => {
  const [formData, setFormData] = useState({
    documentType: '',
    resourceId: '',
    file: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const documentTypes = [
    { value: 'CIN', label: 'CIN' },
    { value: 'Passport', label: 'Passport' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.documentType)
      newErrors.documentType = 'Document type is required';

    if (!formData.file)
      newErrors.file = 'Please select a file';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadStatus(null);

    const submitData = new FormData();
    submitData.append('file', formData.file);
    submitData.append('documentType', formData.documentType);
    submitData.append('resource', formData.resourceId || '');

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/document',
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUploadStatus({
        type: 'success',
        message: 'Document uploaded successfully!'
      });

    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: error.response?.data?.message || 'Upload failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">

      {/* Header Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Upload Document</h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload your documents securely to the event planning system
        </p>
      </motion.div>

      {/* Card Animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="px-6 py-8 sm:p-10">

          {/* Animated Status */}
          <AnimatePresence>
            {uploadStatus && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  uploadStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {uploadStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <p className="text-sm font-medium">{uploadStatus.message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document Type *
              </label>
              <select
                value={formData.documentType}
                onChange={(e) =>
                  setFormData({ ...formData, documentType: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Select document type</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document File *
              </label>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative border-2 border-dashed rounded-lg p-6 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                {!formData.file ? (
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 text-sm text-gray-600">
                      <label className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            setFormData({ ...formData, file: e.target.files[0] })
                          }
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-sm">{formData.file.name}</p>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, file: null })
                      }
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Submit Button Animation */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? "Uploading..." : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Document
                </>
              )}
            </motion.button>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentUpload;