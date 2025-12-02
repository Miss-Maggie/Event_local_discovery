// Category filter component for filtering events
import { Category } from "@/types/event";
import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* All Categories */}
      <Badge
        variant={selectedCategory === null ? "default" : "outline"}
        className={`cursor-pointer transition-all ${
          selectedCategory === null
            ? "bg-primary text-primary-foreground"
            : "hover:bg-primary/10"
        }`}
        onClick={() => onSelectCategory(null)}
      >
        All Events
      </Badge>

      {/* Individual Categories */}
      {categories.map((category) => (
        <Badge
          key={category.id}
          variant={selectedCategory === category.slug ? "default" : "outline"}
          className={`cursor-pointer transition-all ${
            selectedCategory === category.slug
              ? "bg-primary text-primary-foreground"
              : "hover:bg-primary/10"
          }`}
          onClick={() => onSelectCategory(category.slug)}
        >
          {category.icon} {category.name}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilter;
