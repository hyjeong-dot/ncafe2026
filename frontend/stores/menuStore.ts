import { create } from 'zustand';
import { Menu } from '@/types/menu';
import { mockMenus } from '@/mocks/menuData';

interface MenuState {
    // Data
    menus: Menu[];

    // Actions
    addMenu: (menu: Menu) => void;
    deleteMenu: (menuId: string) => void;
    toggleSoldOut: (menuId: string) => void;
    getMenuById: (menuId: string) => Menu | undefined;

    // Reset (for testing purposes)
    resetMenus: () => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
    // Initialize with mock data
    menus: mockMenus,

    // Add a new menu
    addMenu: (menu: Menu) => {
        set((state) => ({
            menus: [...state.menus, menu],
        }));
    },

    // Delete a menu by ID
    deleteMenu: (menuId: string) => {
        set((state) => ({
            menus: state.menus.filter((menu) => menu.id !== menuId),
        }));
    },

    // Toggle sold out status
    toggleSoldOut: (menuId: string) => {
        set((state) => ({
            menus: state.menus.map((menu) =>
                menu.id === menuId ? { ...menu, isSoldOut: !menu.isSoldOut } : menu
            ),
        }));
    },

    // Get a single menu by ID
    getMenuById: (menuId: string) => {
        return get().menus.find((menu) => menu.id === menuId);
    },

    // Reset to initial mock data
    resetMenus: () => {
        set({ menus: mockMenus });
    },
}));

