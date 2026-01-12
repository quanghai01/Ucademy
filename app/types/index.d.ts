interface Item {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface ActiveLinkProps {
  item: Item;
}

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  followers: number;
  instructor?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  isNew?: boolean;
  price?: number;
  rating?: number;
  reviewCount?: number;
}

interface TCreateUserParams {
  clerkId: string;
  email: string;
  username?: string | null;
  name?: string;
  avatar?: string;
}

export { Item, ActiveLinkProps, Course, TCreateUserParams };
