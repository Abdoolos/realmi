// Mock integrations to replace Base44 integrations
// These provide local alternatives for file uploads, AI, and other services

// Mock Core integration
export const Core = {
  // Mock LLM invocation
  InvokeLLM: async (params) => {
    console.log('Local mode - LLM invocation not available:', params);
    return {
      success: false,
      message: 'Local mode - AI services not available',
      data: null
    };
  },

  // Mock email sending
  SendEmail: async (params) => {
    console.log('Local mode - Email sending simulated:', params);
    return {
      success: true,
      message: 'Local mode - Email would be sent',
      data: { messageId: 'local_' + Date.now() }
    };
  },

  // Mock file upload
  UploadFile: async (params) => {
    console.log('Local mode - File upload simulated:', params);
    return {
      success: true,
      message: 'Local mode - File upload simulated',
      data: { 
        url: 'data:text/plain;base64,TG9jYWwgbW9kZSAtIEZpbGUgbm90IGF2YWlsYWJsZQ==',
        filename: params.filename || 'local_file.txt'
      }
    };
  },

  // Mock image generation
  GenerateImage: async (params) => {
    console.log('Local mode - Image generation simulated:', params);
    return {
      success: true,
      message: 'Local mode - Image generation simulated',
      data: { 
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9jYWwgTW9kZTwvdGV4dD48L3N2Zz4=',
        filename: 'generated_image.svg'
      }
    };
  },

  // Mock data extraction from files
  ExtractDataFromUploadedFile: async (params) => {
    console.log('Local mode - Data extraction simulated:', params);
    return {
      success: true,
      message: 'Local mode - Data extraction simulated',
      data: { 
        extractedText: 'Local mode - File content extraction not available',
        metadata: { pages: 1, words: 10 }
      }
    };
  },

  // Mock signed URL creation
  CreateFileSignedUrl: async (params) => {
    console.log('Local mode - Signed URL creation simulated:', params);
    return {
      success: true,
      message: 'Local mode - Signed URL created',
      data: { 
        signedUrl: 'data:text/plain;base64,TG9jYWwgbW9kZSAtIEZpbGUgbm90IGF2YWlsYWJsZQ==',
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      }
    };
  },

  // Mock private file upload
  UploadPrivateFile: async (params) => {
    console.log('Local mode - Private file upload simulated:', params);
    return {
      success: true,
      message: 'Local mode - Private file upload simulated',
      data: { 
        fileId: 'local_' + Date.now(),
        url: 'data:text/plain;base64,TG9jYWwgbW9kZSAtIFByaXZhdGUgZmlsZSBub3QgYXZhaWxhYmxl',
        filename: params.filename || 'private_file.txt'
      }
    };
  }
};

// Export individual functions for backward compatibility
export const InvokeLLM = Core.InvokeLLM;
export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
export const CreateFileSignedUrl = Core.CreateFileSignedUrl;
export const UploadPrivateFile = Core.UploadPrivateFile;
