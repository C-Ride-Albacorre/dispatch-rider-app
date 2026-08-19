import { Socket } from 'socket.io-client';
import { create } from 'zustand';

export type OrderStatus =
  | 'ORDER_ASSIGNED'
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'IN_TRANSIT'
  | string;

export interface ActiveOrderProps {
  order_id: string;
  order_number: string;
  order_status: OrderStatus;

  store_id: string;
  store_name: string;
  store_logo: string;

  store_lat: number;
  store_lng: number;

  total_amount: number;

  distance_meters?: number;

  pickup_location: {
    address: string;
    latitude: number;
    longitude: number;
    storeName: string;
    storeId: string;
  };

  dropoff_location: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];

  created_at: string;
  assigned_at: string;
}

export type DriverLocation = {
  lat: number;
  lng: number;
  heading?: number;
};

export type DriverInfo = {
  driver_id: string;
  driver_name: string;
  driver_photo: string | null;
  driver_phone: string;
  driver_rating: number;
  driver_total_trips: number;
  driver_status: string;
};

type DriverJobsState = {
  /** SOCKET */
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;

  /** ORDER LIFECYCLE */
  activeOrder: ActiveOrderProps | null;
  orderStatus: OrderStatus | null;

  setActiveOrder: (order: ActiveOrderProps | null) => void;
  setOrderStatus: (status: OrderStatus) => void;

  clearActiveOrder: () => void;

  /** DERIVED SAFE ACCESS (prevents null flicker in UI) */
  hasActiveOrder: () => boolean;

  /** DRIVER INFO (for the assigned driver) */
  driverInfo: DriverInfo | null;
  setDriverInfo: (driver: DriverInfo | null) => void;

  /** TRACKING */
  driverLocation: DriverLocation | null;
  setDriverLocation: (loc: DriverLocation | null) => void;

  etaToVendor: number | null;
  etaToCustomer: number | null;

  setEta: (type: 'vendor' | 'customer', value: number | null) => void;

  polylineToVendor: string | null;
  polylineToCustomer: string | null;

  setPolyline: (type: 'vendor' | 'customer', value: string | null) => void;

  clearTracking: () => void;

  /** INCOMING ORDERS */
  incomingOrders: any[];
  addOrder: (order: any) => void;
  removeOrder: (orderId: string) => void;
  clearIncoming: () => void;
};

export const useDriverJobsStore = create<DriverJobsState>((set, get) => ({
  /** SOCKET */
  socket: null,
  setSocket: (socket) => set({ socket }),

  /** ORDER */
  activeOrder: null,
  orderStatus: null,

  setActiveOrder: (order) =>
    set({
      activeOrder: order,
      orderStatus: order?.order_status ?? null,
    }),

  setOrderStatus: (status) =>
    set((state) => ({
      orderStatus: status,
      activeOrder: state.activeOrder
        ? { ...state.activeOrder, order_status: status }
        : null,
    })),

  clearActiveOrder: () =>
    set({
      activeOrder: null,
      orderStatus: null,
      incomingOrders: [],
      driverInfo: null,
      driverLocation: null,
      etaToVendor: null,
      etaToCustomer: null,
      polylineToVendor: null,
      polylineToCustomer: null,
    }),

  hasActiveOrder: () => !!get().activeOrder?.order_id,

  /** DRIVER INFO */
  driverInfo: null,
  setDriverInfo: (driver) => set({ driverInfo: driver }),

  /** TRACKING */
  driverLocation: null,
  setDriverLocation: (loc) => set({ driverLocation: loc }),

  etaToVendor: null,
  etaToCustomer: null,

  setEta: (type, value) =>
    set((state) => ({
      etaToVendor: type === 'vendor' ? value : state.etaToVendor,
      etaToCustomer: type === 'customer' ? value : state.etaToCustomer,
    })),

  polylineToVendor: null,
  polylineToCustomer: null,

  setPolyline: (type, value) =>
    set((state) => ({
      polylineToVendor: type === 'vendor' ? value : state.polylineToVendor,
      polylineToCustomer:
        type === 'customer' ? value : state.polylineToCustomer,
    })),

  clearTracking: () =>
    set({
      driverLocation: null,
      etaToVendor: null,
      etaToCustomer: null,
      polylineToVendor: null,
      polylineToCustomer: null,
    }),

  /** INCOMING */
  incomingOrders: [],

  addOrder: (order) =>
    set((state) => {
      // Normalize order ID (handle both order_id and orderId)
      const orderId = order?.order_id ?? order?.orderId;

      // Don't add if no ID found
      if (!orderId) {
        console.warn('[driver-jobs-store] Order has no id:', order);
        return { incomingOrders: state.incomingOrders };
      }

      return {
        incomingOrders: [
          order,
          ...state.incomingOrders.filter((o) => {
            const oId = o?.order_id ?? o?.orderId;
            return oId !== orderId;
          }),
        ],
      };
    }),

  removeOrder: (orderId) =>
    set((state) => ({
      incomingOrders: state.incomingOrders.filter((o) => {
        const oId = o?.order_id ?? o?.orderId;
        return oId !== orderId;
      }),
    })),

  clearIncoming: () => set({ incomingOrders: [] }),
}));
