import { create } from 'zustand';
import { Menu } from '@/types/menu';

interface MenuState {
    // Data
    menus: Menu[];

    // Actions
    setMenus: (menus: Menu[]) => void;
    addMenu: (menu: Menu) => void;
    updateMenu: (menuId: string, updates: Partial<Menu>) => void;
    deleteMenu: (menuId: string) => void;
    toggleSoldOut: (menuId: string) => void;
    reorderMenus: (activeId: string, overId: string) => void;
    getMenuById: (menuId: string) => Menu | undefined;

    // Reset (for testing purposes)
    resetMenus: () => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
    // Initialize with empty array
    menus: [],

    // Set all menus
    setMenus: (menus: Menu[]) => set({ menus }),

    // Add a new menu
    addMenu: (menu: Menu) => {
        set((state) => ({
            menus: [...state.menus, menu],
        }));
    },

    // Update an existing menu
    updateMenu: (menuId: string, updates: Partial<Menu>) => {
        set((state) => ({
            menus: state.menus.map((menu) =>
                menu.id === menuId ? { ...menu, ...updates, updatedAt: new Date() } : menu
            ),
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

    // Reorder menus (drag and drop)
    reorderMenus: (activeId: string, overId: string) => {
        set((state) => {
            const oldIndex = state.menus.findIndex((m) => m.id === activeId);
            const newIndex = state.menus.findIndex((m) => m.id === overId);

            if (oldIndex === -1 || newIndex === -1) return state;

            const newMenus = [...state.menus];
            const [movedItem] = newMenus.splice(oldIndex, 1);
            newMenus.splice(newIndex, 0, movedItem);

            // Update sortOrder for all items
            return {
                menus: newMenus.map((menu, index) => ({
                    ...menu,
                    sortOrder: index + 1,
                })),
            };
        });
    },

    // Get a single menu by ID
    getMenuById: (menuId: string) => {
        return get().menus.find((menu) => menu.id === menuId);
    },

    // Reset menus
    resetMenus: () => {
        set({ menus: [] });
    },
}));
