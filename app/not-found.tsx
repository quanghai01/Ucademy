import React from "react";
import Link from "next/link";
const PageNotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>

      <p className="mt-4 text-xl text-gray-600">
        Trang bạn tìm kiếm không tồn tại
      </p>

      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default PageNotFound;
