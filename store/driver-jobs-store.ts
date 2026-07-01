import { create } from 'zustand';
import { Socket } from 'socket.io-client';

export type DriverOrder = {
  order_id: string;
  order_number?: string;
  order_status?: string;

  store_name?: string;
  store_logo?: string;

  total_amount: number;

  pickup_location?: {
    latitude: number;
    longitude: number;
    storeName?: string;
  };

  dropoff_location?: {
    address?: string;
  };

  created_at?: string;
};

export type OrderHistoryItem = {
  status: string;
  timestamp: string;
};

export type DriverLocationPayload = {
  lat: number;
  lng: number;
  heading?: number;
};

export interface ActiveOrderProps {
  assigned_at: string;
  created_at: string;

  distance_meters: number;

  order_id: string;
  order_number: string;

  order_status: string;

  total_amount: number;

  rn: string;

  store_id: string;
  store_lat: number;
  store_lng: number;
  store_logo: string;
  store_name: string;

  pickup_location: {
    address: string;
    latitude: number;
    longitude: number;
    storeId: string;
    storeName: string;
  };

  dropoff_location: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    state: string;
  };

  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

type DriverJobsState = {
  /**
   * SOCKET
   */
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;

  /**
   * ACTIVE ORDER
   */
  activeOrder: ActiveOrderProps | null;
  setActiveOrder: (order: ActiveOrderProps | null) => void;

  /**
   * LIVE TRACKING
   */
  tracking: {
    driverLocation: DriverLocationPayload | null;

    eta: {
      toVendor: number | null;
      toCustomer: number | null;
    };

    polylines: {
      toVendor: string | null;
      toCustomer: string | null;
    };

    orderStatus: string | null;

    history: OrderHistoryItem[];
  };

  setDriverLocation: (location: DriverLocationPayload | null) => void;

  setEta: (leg: 'to-vendor' | 'to-customer', eta: number | null) => void;

  setPolyline: (
    leg: 'to-vendor' | 'to-customer',
    polyline: string | null,
  ) => void;

  setOrderStatus: (status: string | null) => void;

  setHistory: (history: OrderHistoryItem[]) => void;

  clearTracking: () => void;

  /**
   * INCOMING JOBS
   */
  incomingOrders: DriverOrder[];

  addOrder: (order: DriverOrder) => void;

  removeOrder: (orderId: string) => void;

  clearOrders: () => void;
};

export const useDriverJobsStore = create<DriverJobsState>((set) => ({
  /**
   * SOCKET
   */
  socket: null,

  setSocket: (socket) =>
    set({
      socket,
    }),

  /**
   * ACTIVE ORDER
   */
  activeOrder: null,

  setActiveOrder: (order) =>
    set({
      activeOrder: order,
    }),

  /**
   * TRACKING
   */
  tracking: {
    driverLocation: null,

    eta: {
      toVendor: null,
      toCustomer: null,
    },

    polylines: {
      toVendor: null,
      toCustomer: null,
    },

    orderStatus: null,

    history: [],
  },

  setDriverLocation: (location) =>
    set((state) => ({
      tracking: {
        ...state.tracking,
        driverLocation: location,
      },
    })),

  setEta: (leg, eta) =>
    set((state) => ({
      tracking: {
        ...state.tracking,
        eta: {
          ...state.tracking.eta,
          [leg === 'to-vendor' ? 'toVendor' : 'toCustomer']: eta,
        },
      },
    })),

  setPolyline: (leg, polyline) =>
    set((state) => ({
      tracking: {
        ...state.tracking,
        polylines: {
          ...state.tracking.polylines,
          [leg === 'to-vendor' ? 'toVendor' : 'toCustomer']: polyline,
        },
      },
    })),

  setOrderStatus: (status) =>
    set((state) => ({
      tracking: {
        ...state.tracking,
        orderStatus: status,
      },
    })),

  setHistory: (history) =>
    set((state) => ({
      tracking: {
        ...state.tracking,
        history,
      },
    })),

  clearTracking: () =>
    set((state) => ({
      tracking: {
        ...state.tracking,

        driverLocation: null,

        eta: {
          toVendor: null,
          toCustomer: null,
        },

        polylines: {
          toVendor: null,
          toCustomer: null,
        },

        orderStatus: null,

        history: [],
      },
    })),

  /**
   * INCOMING JOBS
   */
  incomingOrders: [],

  addOrder: (order) =>
    set((state) => ({
      incomingOrders: [
        order,
        ...state.incomingOrders.filter((o) => o.order_id !== order.order_id),
      ],
    })),

  removeOrder: (orderId) =>
    set((state) => ({
      incomingOrders: state.incomingOrders.filter(
        (o) => o.order_id !== orderId,
      ),
    })),

  clearOrders: () =>
    set({
      incomingOrders: [],
    }),
}));
