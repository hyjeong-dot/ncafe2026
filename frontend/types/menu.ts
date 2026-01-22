// Menu Image Type
export interface MenuImage {
    id: string;
    url: string;
    isPrimary: boolean;
    sortOrder: number;
}

// Menu Option Item Type
export interface OptionItem {
    id: string;
    name: string;
    priceDelta: number; // 추가 가격 (0이면 무료)
}

// Menu Option Type
export interface MenuOption {
    id: string;
    name: string;
    type: 'radio' | 'checkbox';
    required: boolean;
    items: OptionItem[];
}

// Menu Category Type
export interface MenuCategory {
    id: string;
    korName: string;
    engName: string;
    icon?: string;
    sortOrder: number;
}

// Menu Type
export interface Menu {
    id: string;
    korName: string;
    engName: string;
    description: string;
    price: number;
    category: MenuCategory;
    images: MenuImage[];
    isAvailable: boolean;
    isSoldOut: boolean;
    sortOrder: number;
    options: MenuOption[];
    createdAt: Date;
    updatedAt: Date;
}

// Menu Status for filtering
export type MenuStatus = 'all' | 'available' | 'soldOut' | 'hidden';
