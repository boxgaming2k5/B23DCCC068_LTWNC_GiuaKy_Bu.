import { Book, ApiResponse } from '../types/book';

/**
 * Mock data: Danh sách các đầu sách chuyên ngành thư viện khoa
 * Bổ sung hệ thống định danh khoa học quốc tế (ISBN, Dewey Decimal DDC, DOI)
 */
const INITIAL_BOOKS: Book[] = [
  {
    id: 'b-001',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    genre: 'CNTT',
    publishedYear: 2008,
    availableCopies: 3,
    totalCopies: 5,
    description: 'Cuốn sách kinh điển hướng dẫn viết mã nguồn sạch, kiến trúc mô-đun hóa dễ đọc, dễ kiểm thử và bảo trì.',
    isbn: '978-0132350884',
    ddc: '005.117',
    doi: '10.1145/337.892',
  },
  {
    id: 'b-002',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    genre: 'CNTT',
    publishedYear: 2017,
    availableCopies: 0, // Đã hết bản để test chức năng vô hiệu hóa nút mượn
    totalCopies: 4,
    description: 'Hướng dẫn kiến trúc hệ thống dữ liệu phân tán quy mô lớn, tính nhất quán dữ liệu và độ tin cậy mở rộng.',
    isbn: '978-1449373320',
    ddc: '005.74',
    doi: '10.1007/978-3-319',
  },
  {
    id: 'b-003',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    genre: 'CNTT',
    publishedYear: 1994,
    availableCopies: 2,
    totalCopies: 3,
    description: '23 mẫu thiết kế hướng đối tượng kinh điển của Gang of Four giải quyết các bài toán kiến trúc phần mềm tái sử dụng.',
    isbn: '978-0201633610',
    ddc: '005.12',
    doi: '10.1109/TSE.1995.4',
  },
  {
    id: 'b-004',
    title: "You Don't Know JS Yet: Scope & Closures",
    author: 'Kyle Simpson',
    genre: 'CNTT',
    publishedYear: 2020,
    availableCopies: 4,
    totalCopies: 6,
    description: 'Nghiên cứu đào sâu cơ chế thực thi bên dưới của JavaScript: Lexical Scope, Closure, Hoisting và Memory Leaks.',
    isbn: '979-8602477429',
    ddc: '005.2762',
    doi: '10.1145/338.711',
  },
  {
    id: 'b-005',
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    genre: 'CNTT',
    publishedYear: 2018,
    availableCopies: 1,
    totalCopies: 2,
    description: 'Các kỹ thuật tái cấu trúc mã nguồn an toàn với kiểm thử tự động, chuẩn hóa cấu trúc phần mềm hiện đại.',
    isbn: '978-0134757599',
    ddc: '005.1',
    doi: '10.1002/spe.4380',
  },
  {
    id: 'b-006',
    title: 'Nguyên lý Kinh tế học (Principles of Economics)',
    author: 'N. Gregory Mankiw',
    genre: 'Kinh tế',
    publishedYear: 2020,
    availableCopies: 5,
    totalCopies: 8,
    description: 'Giáo trình kinh tế học nền tảng toàn diện nhất phân tích quy luật cung cầu, thị trường tiền tệ và chính sách vĩ mô.',
    isbn: '978-0357038314',
    ddc: '330.1',
    doi: '10.1257/aer.110.1',
  },
  {
    id: 'b-007',
    title: 'Chiến Lược Đại Dương Xanh (Blue Ocean Strategy)',
    author: 'W. Chan Kim, Renée Mauborgne',
    genre: 'Kinh tế',
    publishedYear: 2015,
    availableCopies: 2,
    totalCopies: 4,
    description: 'Phương pháp luận đột phá tạo lập không gian thị trường mới không cạnh tranh và chuyển hướng giá trị sáng tạo.',
    isbn: '978-1625274496',
    ddc: '658.4012',
    doi: '10.1016/j.lrp.2005.02',
  },
  {
    id: 'b-008',
    title: 'Nguyên lý Tiếp thị (Principles of Marketing)',
    author: 'Philip Kotler, Gary Armstrong',
    genre: 'Kinh tế',
    publishedYear: 2021,
    availableCopies: 0, // Hết sách
    totalCopies: 3,
    description: 'Cẩm nang toàn diện về quản trị tiếp thị đa kênh, xây dựng thương hiệu và phân tích hành vi người tiêu dùng số.',
    isbn: '978-0135766606',
    ddc: '658.8',
    doi: '10.1177/0022242921',
  },
  {
    id: 'b-009',
    title: 'Tài Chính Doanh Nghiệp (Corporate Finance)',
    author: 'Stephen A. Ross, Randolph W. Westerfield',
    genre: 'Kinh tế',
    publishedYear: 2022,
    availableCopies: 3,
    totalCopies: 5,
    description: 'Mô hình định giá tài sản tài chính, hoạch định ngân sách vốn, cấu trúc vốn tối ưu và quản trị rủi ro đầu tư.',
    isbn: '978-1260772395',
    ddc: '658.15',
    doi: '10.1111/jofi.1287',
  },
  {
    id: 'b-010',
    title: 'English Grammar in Use (5th Edition)',
    author: 'Raymond Murphy',
    genre: 'Ngoại ngữ',
    publishedYear: 2019,
    availableCopies: 6,
    totalCopies: 10,
    description: 'Tài liệu chuẩn mực quốc tế về hệ thống ngữ pháp tiếng Anh trung cấp và cao cấp với hàng ngàn bài tập ngữ dụng.',
    isbn: '978-1108457651',
    ddc: '428.24',
    doi: '10.1017/s02614448',
  },
  {
    id: 'b-011',
    title: 'Oxford Advanced Learner’s Dictionary (10th Edition)',
    author: 'AS Hornby',
    genre: 'Ngoại ngữ',
    publishedYear: 2020,
    availableCopies: 2,
    totalCopies: 5,
    description: 'Đại từ điển ngôn ngữ học Anh ngữ học thuật, giải nghĩa sâu với ngữ cảnh corpus quốc tế 100 triệu từ vựng.',
    isbn: '978-0194798488',
    ddc: '423.02',
    doi: '10.1093/applin/amaa',
  },
  {
    id: 'b-012',
    title: 'Official Cambridge Guide to IELTS',
    author: 'Pauline Cullen, Amanda French',
    genre: 'Ngoại ngữ',
    publishedYear: 2014,
    availableCopies: 1,
    totalCopies: 4,
    description: 'Giáo trình luyện thi chuẩn hóa của Hội đồng Khảo thí Cambridge cho cả 2 hệ Academic và General Training.',
    isbn: '978-1107620698',
    ddc: '428.0076',
    doi: '10.1017/cambridge.ielts',
  },
];

/**
 * API giả lập lấy danh sách sách từ thư viện khoa
 * @param shouldFail Tham số giả lập lỗi kết nối máy chủ
 * @param delayMs Thời gian giả lập độ trễ (mặc định 500ms theo đề bài)
 * @returns Promise trả về kiểu generic ApiResponse<Book[]>
 */
export const fetchBooksApi = (
  shouldFail: boolean = false,
  delayMs: number = 500
): Promise<ApiResponse<Book[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không thể kết nối đến máy chủ thư viện khoa. Vui lòng kiểm tra đường truyền và thử lại.',
          code: 'ERR_NETWORK_DISCONNECTED',
        });
      } else {
        // Deep clone dữ liệu để tránh mutation
        resolve({
          ok: true,
          data: JSON.parse(JSON.stringify(INITIAL_BOOKS)),
          message: 'Lấy danh sách sách thành công.',
        });
      }
    }, delayMs);
  });
};
