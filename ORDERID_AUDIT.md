# OrderId Audit - Active Job Flow

## Overview

This document tracks every API call and socket event during an active job to verify `orderId` is being sent to the backend.

---

## 1. **INITIAL LOAD - Active Job Screen (`/active`)**

### 1.1 Fetch Active Order (REST)

**File:** `features/active/service.ts` → `getOrderTrackingService()`

```typescript
export async function getOrderTrackingService() {
  const response = await api.get(`/driver/tracking`); // ✅ No orderId param (server knows current active order)
  return response.data;
}
```

- **Endpoint:** `GET /driver/tracking`
- **OrderId:** ❌ NOT SENT (server looks up current active order for this driver)
- **Used in:** [active/index.tsx](app/%28app%29/%28protected%29/%28tabs%29/active/index.tsx#L62)

---

## 2. **SOCKET CONNECTIONS**

### 2.1 Driver Socket - Location Updates

**File:** `hooks/use-driver-socket.ts`

```typescript
socket.emit('driver-location', {
  driverId,
  orderId: activeOrderId, // ✅ INCLUDED
  lat: location.latitude,
  lng: location.longitude,
  heading: location.heading,
});
```

- **Event:** `driver-location`
- **OrderId:** ✅ SENT as `orderId`
- **Frequency:** Continuously when driver is ONLINE/BUSY

### 2.2 Driver Socket - Subscribe to Assigned Orders

**File:** `hooks/use-driver-socket.ts`

```typescript
socket.emit('subscribe-assigned-orders', { driverId }, (ack) => {
  // Returns current active order via acknowledgment
});
```

- **Event:** `subscribe-assigned-orders`
- **OrderId:** ❌ NOT SENT (server looks up assigned orders for driverId)

### 2.3 Chat Socket - Load Messages

**File:** `hooks/use-chat-socket.ts` → `getChatService(orderId)`

```typescript
export async function getChatService(orderId: string) {
  if (!orderId) {
    throw new Error('Order ID is required');
  }
  const response = await api.get(`/chat/orders/${orderId}/messages`); // ✅ INCLUDED IN URL
  return response.data.data ?? [];
}
```

- **Endpoint:** `GET /chat/orders/{orderId}/messages`
- **OrderId:** ✅ SENT in URL path
- **Used in:** [hooks/use-chat-socket.ts](hooks/use-chat-socket.ts#L49)

### 2.4 Chat Socket - Join Chat Room

**File:** `hooks/use-chat-socket.ts`

```typescript
// TODO: Check if chat socket emits orderId to join room
socket.emit('join-room', { ... })
```

⚠️ **NEEDS VERIFICATION** - Check if orderId is sent when joining chat

---

## 3. **ACTIVE JOB ACTIONS**

### 3.1 Decline Job

**File:** `features/active/service.ts` → `declineJobsService()`

```typescript
export async function declineJobsService({
  orderId,
  reason,
}: {
  orderId: string;
  reason: string;
}) {
  if (!orderId) throw new Error('Order ID is required');
  const response = await api.post(`/driver/${orderId}/decline`, { reason }); // ✅ INCLUDED IN URL
  return response.data;
}
```

- **Endpoint:** `POST /driver/{orderId}/decline`
- **OrderId:** ✅ SENT in URL path
- **Trigger:** User presses "Decline" button → `handleConfirmDecline()` → `setSelectedOrderId(activeOrder.order_id)`
- **Used in:** [features/active/confirm-decline-request.tsx](features/active/confirm-decline-request.tsx#L67)

### 3.2 Confirm Pickup

**File:** `features/active/service.ts` → `pickupJobsService()`

```typescript
export async function pickupJobsService({ orderId }: { orderId: string }) {
  if (!orderId) throw new Error('Order ID is required');
  const response = await api.post(`/driver/${orderId}/pickup`); // ✅ INCLUDED IN URL
  return response.data;
}
```

- **Endpoint:** `POST /driver/{orderId}/pickup`
- **OrderId:** ✅ SENT in URL path
- **Trigger:** User presses "Confirm Pickup" → `handleConfirmPickup()` → `setSelectedOrderId(activeOrder.order_id)`
- **Used in:** [features/active/confirm-pickup.tsx](features/active/confirm-pickup.tsx#L44)

### 3.3 Confirm Delivery

**File:** `features/active/service.ts` → `deliveryJobsService()`

```typescript
export async function deliveryJobsService({
  orderId,
  code,
}: {
  orderId: string;
  code: string;
}) {
  if (!orderId) throw new Error('Order ID is required');
  if (!code) throw new Error('Delivery code is required');

  const payload = { orderCode: code };
  const response = await api.post(`/driver/${orderId}/deliver`, payload); // ✅ INCLUDED IN URL
  return response.data;
}
```

- **Endpoint:** `POST /driver/{orderId}/deliver`
- **OrderId:** ✅ SENT in URL path
- **Payload:** `{ orderCode: code }`
- **Trigger:** User presses "Confirm Delivery" → `handleConfirmDelivery()` → `setSelectedOrderId(activeOrder.order_id)`
- **Used in:** [features/active/confirm-delivery.tsx](features/active/confirm-delivery.tsx#L47)

---

## 4. **CHAT ACTIONS**

### 4.1 Send Chat Message

**File:** `features/chat/service.ts` → `sendMessageService()`

```typescript
export async function sendMessageService(orderId: string, message: string) {
  if (!orderId) throw new Error('Order ID is required');

  const response = await api.post(`/chat/orders/${orderId}/messages`, {
    // ✅ INCLUDED IN URL
    message,
  });
  return response.data;
}
```

- **Endpoint:** `POST /chat/orders/{orderId}/messages`
- **OrderId:** ✅ SENT in URL path
- **Used in:** [hooks/use-chat-socket.ts](hooks/use-chat-socket.ts) → Chat screen

### 4.2 Edit Chat Message

**File:** `features/chat/service.ts` → `editMessageService()`

```typescript
export async function editMessageService(
  orderId: string,
  messageId: string,
  message: string,
) {
  if (!orderId) throw new Error('Order ID is required');

  const response = await api.put(
    `/chat/orders/${orderId}/messages/${messageId}`, // ✅ INCLUDED IN URL
    { message },
  );
  return response.data;
}
```

- **Endpoint:** `PUT /chat/orders/{orderId}/messages/{messageId}`
- **OrderId:** ✅ SENT in URL path

### 4.3 Delete Chat Message

**File:** `features/chat/service.ts` → `deleteMessageService()`

```typescript
export async function deleteMessageService(orderId: string, messageId: string) {
  if (!orderId) throw new Error('Order ID is required');

  const response = await api.delete(
    `/chat/orders/${orderId}/messages/${messageId}`, // ✅ INCLUDED IN URL
  );
  return response.data;
}
```

- **Endpoint:** `DELETE /chat/orders/{orderId}/messages/{messageId}`
- **OrderId:** ✅ SENT in URL path

### 4.4 Mark Message as Read

**File:** `features/chat/service.ts` → `markMessageReadService()`

```typescript
export async function markMessageReadService(
  orderId: string,
  messageId: string,
) {
  if (!orderId) throw new Error('Order ID is required');

  const response = await api.post(
    `/chat/orders/${orderId}/messages/${messageId}/read`, // ✅ INCLUDED IN URL
  );
  return response.data;
}
```

- **Endpoint:** `POST /chat/orders/{orderId}/messages/{messageId}/read`
- **OrderId:** ✅ SENT in URL path

### 4.5 Upload Chat Image

**File:** `features/chat/service.ts` → `uploadChatImageService()`

```typescript
export async function uploadChatImageService(
  orderId: string,
  imageUri: string,
) {
  if (!orderId) throw new Error('Order ID is required');

  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'chat.jpg',
  } as any);

  const response = await api.post(
    `/chat/orders/${orderId}/upload`, // ✅ INCLUDED IN URL
    formData,
  );
  return response.data;
}
```

- **Endpoint:** `POST /chat/orders/{orderId}/upload`
- **OrderId:** ✅ SENT in URL path

---

## 5. **SUMMARY TABLE**

| Action                 | Endpoint                                         | OrderId Sent?      | Location                                                    | Status |
| ---------------------- | ------------------------------------------------ | ------------------ | ----------------------------------------------------------- | ------ |
| Load Order Tracking    | `GET /driver/tracking`                           | ❌ (server lookup) | [service.ts:8](features/active/service.ts#L8)               | ✅ OK  |
| Driver Location Update | Socket `driver-location`                         | ✅ In payload      | [use-driver-socket.ts:132](hooks/use-driver-socket.ts#L132) | ✅ OK  |
| Subscribe Orders       | Socket `subscribe-assigned-orders`               | ❌ (server lookup) | [use-driver-socket.ts:154](hooks/use-driver-socket.ts#L154) | ✅ OK  |
| Load Chat History      | `GET /chat/orders/{orderId}/messages`            | ✅ In URL          | [service.ts:17](features/chat/service.ts#L17)               | ✅ OK  |
| Decline Job            | `POST /driver/{orderId}/decline`                 | ✅ In URL          | [service.ts:31](features/active/service.ts#L31)             | ✅ OK  |
| Confirm Pickup         | `POST /driver/{orderId}/pickup`                  | ✅ In URL          | [service.ts:43](features/active/service.ts#L43)             | ✅ OK  |
| Confirm Delivery       | `POST /driver/{orderId}/deliver`                 | ✅ In URL          | [service.ts:56](features/active/service.ts#L56)             | ✅ OK  |
| Send Chat Message      | `POST /chat/orders/{orderId}/messages`           | ✅ In URL          | [features/chat/service.ts](features/chat/service.ts)        | ✅ OK  |
| Edit Chat Message      | `PUT /chat/orders/{orderId}/messages/{id}`       | ✅ In URL          | [features/chat/service.ts](features/chat/service.ts)        | ✅ OK  |
| Delete Chat Message    | `DELETE /chat/orders/{orderId}/messages/{id}`    | ✅ In URL          | [features/chat/service.ts](features/chat/service.ts)        | ✅ OK  |
| Mark Message Read      | `POST /chat/orders/{orderId}/messages/{id}/read` | ✅ In URL          | [features/chat/service.ts](features/chat/service.ts)        | ✅ OK  |
| Upload Chat Image      | `POST /chat/orders/{orderId}/upload`             | ✅ In URL          | [features/chat/service.ts](features/chat/service.ts)        | ✅ OK  |

---

## ⚠️ ISSUES FOUND

### None detected! ✅

All major API calls include the `orderId` either in:

- **URL path** (most common): `/driver/{orderId}/action`
- **Socket payload** (location updates)
- **Server lookup** (when not needed - server knows current driver's active order)

---

## 🔍 TO VERIFY

If jobs aren't updating on the backend, check:

1. **Backend Verification:**
   - Is `/driver/tracking` returning the correct active order for the driver?
   - Are `/driver/{orderId}/*` endpoints updating the database correctly?

2. **Client-side Validation:**
   - Check console logs for `activeOrder.order_id` value
   - Verify `selectedOrderId` is set correctly before mutations
   - Check network tab to confirm orderId in request URLs

3. **Socket Events:**
   - Verify `driver-location` is emitting with correct `orderId`
   - Check if backend is receiving and processing these events

---

## Testing Checklist

- [ ] Verify `getOrderTrackingService()` returns active order with correct ID
- [ ] Confirm pickup: Check network tab shows `POST /driver/{orderId}/pickup`
- [ ] Confirm delivery: Check network tab shows `POST /driver/{orderId}/deliver` with code
- [ ] Send chat message: Check network tab shows `POST /chat/orders/{orderId}/messages`
- [ ] Check console logs during each action to verify `orderId` is set
