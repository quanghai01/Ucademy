# Reusable Pagination Components

## 📦 Components Created

### 1. `usePagination` Hook
Location: `app/lib/hooks/usePagination.ts`

Custom hook để xử lý logic pagination cho bất kỳ loại data nào.

### 2. `Pagination` Component  
Location: `components/common/Pagination.tsx`

UI component hiển thị pagination controls.

---

## 🚀 Usage Examples

### Example 1: Course Management (Current)

```tsx
import { usePagination } from "@/app/lib/hooks/usePagination";
import { Pagination } from "@/components/common/Pagination";

const CourseManage = ({ courses }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter courses
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Use pagination hook
  const {
    paginatedItems: paginatedCourses,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
  } = usePagination({
    items: filteredCourses,
    itemsPerPage: 6,
  });
  
  return (
    <div>
      {/* Render courses */}
      {paginatedCourses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
      
      {/* Pagination UI */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCourses.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={goToPage}
        itemLabel="khóa học"
      />
    </div>
  );
};
```

---

### Example 2: User/Member Management

```tsx
const MemberManage = ({ users }) => {
  const {
    paginatedItems: paginatedUsers,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
  } = usePagination({
    items: users,
    itemsPerPage: 10,
  });
  
  return (
    <div>
      <table>
        {paginatedUsers.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </table>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={users.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={goToPage}
        itemLabel="thành viên"
      />
    </div>
  );
};
```

---

### Example 3: Order Management

```tsx
const OrderManage = ({ orders }) => {
  const {
    paginatedItems: paginatedOrders,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
  } = usePagination({
    items: orders,
    itemsPerPage: 20,
  });
  
  return (
    <div>
      {paginatedOrders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={orders.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={goToPage}
        itemLabel="đơn hàng"
      />
    </div>
  );
};
```

---

### Example 4: Comment Management

```tsx
const CommentManage = ({ comments }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredComments = comments.filter(c => 
    statusFilter === "all" || c.status === statusFilter
  );
  
  const pagination = usePagination({
    items: filteredComments,
    itemsPerPage: 15,
  });
  
  return (
    <div>
      {/* Filter */}
      <select onChange={e => setStatusFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
      </select>
      
      {/* Comments list */}
      {pagination.paginatedItems.map(comment => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      
      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={filteredComments.length}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        onPageChange={pagination.goToPage}
        itemLabel="bình luận"
      />
    </div>
  );
};
```

---

## 🎯 API Reference

### `usePagination` Hook

**Parameters:**
```typescript
{
  items: T[];              // Array of items to paginate
  itemsPerPage?: number;   // Items per page (default: 10)
}
```

**Returns:**
```typescript
{
  currentPage: number;           // Current page number (1-indexed)
  totalPages: number;            // Total number of pages
  paginatedItems: T[];           // Items for current page
  startIndex: number;            // Start index in original array
  endIndex: number;              // End index in original array
  setCurrentPage: (n) => void;   // Set page directly
  nextPage: () => void;          // Go to next page
  prevPage: () => void;          // Go to previous page
  goToPage: (n) => void;         // Go to specific page
}
```

---

### `Pagination` Component

**Props:**
```typescript
{
  currentPage: number;        // Current page
  totalPages: number;         // Total pages
  totalItems: number;         // Total items count
  startIndex: number;         // Start index
  endIndex: number;           // End index
  onPageChange: (n) => void;  // Page change handler
  itemLabel?: string;         // Label for items (e.g., "courses", "users")
}
```

---

## ✨ Features

- ✅ **TypeScript Generic** - Works with any data type
- ✅ **Auto Reset** - Resets to page 1 when items change
- ✅ **Smart Page Numbers** - Shows ellipsis for many pages
- ✅ **Responsive** - Mobile-friendly design
- ✅ **Customizable** - Easy to customize label and items per page
- ✅ **No External Dependencies** - Only uses React built-ins

---

## 💡 Benefits

### Before (Inline Pagination)
- ❌ 80+ lines of duplicate code per component
- ❌ Manual state management
- ❌ Copy-paste errors
- ❌ Hard to maintain consistency

### After (Reusable Components)
- ✅ **10 lines** to add pagination
- ✅ Consistent behavior across app
- ✅ Easy to update all paginations at once
- ✅ Type-safe with TypeScript
- ✅ Reduced bundle size

---

## 🎨 Customization

### Change items per page:
```tsx
usePagination({ items, itemsPerPage: 12 })
```

### Change item label:
```tsx
<Pagination itemLabel="sản phẩm" {...props} />
```

### Use custom styling:
The Pagination component uses shadcn/ui components, so you can customize via Tailwind classes or theme.

---

## 📝 Summary

You now have:
1. ✅ Reusable `usePagination` hook for logic
2. ✅ Reusable `Pagination` UI component
3. ✅ Refactored `CourseManage` to use them
4. ✅ Examples for other use cases

Ready to use for: **Courses, Users, Orders, Comments, Lessons, Lectures**, and any other list! 🚀
