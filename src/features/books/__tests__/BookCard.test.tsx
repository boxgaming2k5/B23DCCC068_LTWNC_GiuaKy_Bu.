import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from '../components/BookCard';
import { Book } from '../../../types/book';

describe('BookCard Component tests (Buổi 6 - RTL & userEvent testing)', () => {
  const sampleBook: Book = {
    id: 'b-999',
    title: 'Lập Trình Web Nâng Cao với React & TypeScript',
    author: 'TS. Nguyễn Văn A',
    genre: 'CNTT',
    publishedYear: 2024,
    availableCopies: 5,
    totalCopies: 10,
    description: 'Giáo trình thực hành toàn diện từ cơ bản đến nâng cao.',
  };

  const outOfStockBook: Book = {
    id: 'b-888',
    title: 'Kinh Tế Học Vĩ Mô Hiện Đại',
    author: 'GS. Trần Thị B',
    genre: 'Kinh tế',
    publishedYear: 2023,
    availableCopies: 0, // Hết sách
    totalCopies: 5,
  };

  // Test 1: Hiển thị đúng và đầy đủ thông tin sách
  it('1. should render all book information correctly (title, author, genre, year, available copies)', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    // Kiểm tra tên sách
    expect(
      screen.getByText('Lập Trình Web Nâng Cao với React & TypeScript')
    ).toBeInTheDocument();

    // Kiểm tra tác giả
    expect(screen.getByText('TS. Nguyễn Văn A')).toBeInTheDocument();

    // Kiểm tra thể loại
    expect(screen.getByText('CNTT')).toBeInTheDocument();

    // Kiểm tra năm xuất bản
    expect(screen.getByText('2024')).toBeInTheDocument();

    // Kiểm tra số bản còn lại (5 / 10)
    const copiesElement = screen.getByTestId('copies-b-999');
    expect(copiesElement).toHaveTextContent('5 / 10');

    // Nút mượn phải hiển thị và không bị vô hiệu hóa
    const borrowButton = screen.getByTestId('borrow-btn-b-999');
    expect(borrowButton).toBeInTheDocument();
    expect(borrowButton).not.toBeDisabled();
    expect(borrowButton).toHaveTextContent('Mượn sách');
  });

  // Test 2: Click "Mượn" gọi đúng hàm onBorrow với đúng id cuốn sách
  it('2. should call onBorrow handler with correct book id when "Mượn sách" button is clicked', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowButton = screen.getByTestId('borrow-btn-b-999');
    await user.click(borrowButton);

    // Xác nhận hàm onBorrow được gọi đúng 1 lần với tham số là 'b-999'
    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('b-999');
    expect(handleReturn).not.toHaveBeenCalled();
  });

  // Test 3: Nút bị vô hiệu hoá khi sách đã hết bản (availableCopies === 0)
  it('3. should disable "Mượn" button when the book is out of stock (availableCopies === 0)', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={outOfStockBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowButton = screen.getByTestId('borrow-btn-b-888');
    
    // Nút phải bị disabled
    expect(borrowButton).toBeDisabled();
    expect(borrowButton).toHaveTextContent('Hết sách');

    // Số bản hiển thị 0 / 5 với class out-of-stock
    const copiesElement = screen.getByTestId('copies-b-888');
    expect(copiesElement).toHaveTextContent('0 / 5');
    expect(copiesElement).toHaveClass('out-of-stock');
  });

  // Test 4 (Bổ sung): Hiển thị nút "Trả sách" khi sách đang được mượn và click gọi đúng onReturn
  it('4. should render "Trả sách" button when isBorrowed is true and call onReturn when clicked', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        isBorrowed={true}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    // Kiểm tra trạng thái đang mượn
    expect(screen.getByText('Đang mượn')).toBeInTheDocument();

    const returnButton = screen.getByTestId('return-btn-b-999');
    expect(returnButton).toBeInTheDocument();
    expect(returnButton).toHaveTextContent('Trả sách');

    await user.click(returnButton);

    expect(handleReturn).toHaveBeenCalledTimes(1);
    expect(handleReturn).toHaveBeenCalledWith('b-999');
    expect(handleBorrow).not.toHaveBeenCalled();
  });
});

