import { create } from 'zustand';

type IncomingOrder = {
  orderId: string;
  vendorLocation?: any;
  eta?: number;
};

type DriverJobsStore = {
  incomingOrders: IncomingOrder[];

  addOrder: (order: IncomingOrder) => void;

  removeOrder: (orderId: string) => void;

  

  clearOrders: () => void;
};

export const useDriverJobsStore =
  create<DriverJobsStore>((set) => ({
    incomingOrders: [],

    addOrder: (order) =>
      set((state) => ({
        incomingOrders: [
          order,
          ...state.incomingOrders.filter(
            (x) => x.orderId !== order.orderId,
          ),
        ],
      })),

    removeOrder: (orderId) =>
      set((state) => ({
        incomingOrders: state.incomingOrders.filter(
          (x) => x.orderId !== orderId,
        ),
      })),

    clearOrders: () =>
      set({
        incomingOrders: [],
      }),
  }));