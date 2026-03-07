"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
    name: string
    icon: string
}

interface SearchFiltersProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    categories: Category[]
    selectedCategory: string | null
    onCategoryChange: (category: string | null) => void
}

export default function SearchFilters({
    searchQuery,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange,
}: SearchFiltersProps) {
    return (
        <div className="p-6 border-b space-y-4 bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-xl">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder="Tìm kiếm nhà hàng, món ăn..."
                    className="pl-12 h-12 bg-background/50 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                    <motion.div key={category.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant={selectedCategory === category.name ? "default" : "outline"}
                            size="sm"
                            onClick={() => onCategoryChange(category.name === "Tất cả" ? null : category.name)}
                            className={cn(
                                "whitespace-nowrap gap-2 transition-all",
                                selectedCategory === category.name
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                    : "hover:bg-primary/10 hover:border-primary/50"
                            )}
                        >
                            <span>{category.icon}</span>
                            {category.name}
                        </Button>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

