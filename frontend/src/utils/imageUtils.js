export const normalizeImageUrl = (url) => {
  if (!url) return '/placeholder.png'
  
  // Nếu đã là URL tuyệt đối (http/https), giữ nguyên
  if (url.startsWith('http')) return url
  
  // Nếu bắt đầu bằng /, giữ nguyên
  if (url.startsWith('/')) return url
  
  // Nếu không có / ở đầu, thêm / để thành đường dẫn gốc
  return `/${url}`
}
