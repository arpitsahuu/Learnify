import { apiSlice } from "../api/apiSlice";
import { userUpdateAvatar } from "../auth/authSlice";
interface Order {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[]; // Assuming notes is an array of any type, you can specify a more specific type if needed
  offer_id: string | null;
  receipt: string | null;
  status: string;
}

interface resID {
  id: string;
}

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (type) => ({
        url: `get-orders`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getRazorpayPublishablekey: builder.query({
      query: () => ({
        url: `getkey`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createPaymentIntent: builder.mutation({
      query: (id) => ({
        url: "checkout",
        method: "POST",
        body: {
          id,
        },
        credentials: "include" as const,
      }),
    }),
    createOrder: builder.mutation({
      query: ({ courseId, payment_info }) => ({
        url: "create-order",
        body: {
          courseId,
          payment_info,
        },
        method: "POST",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userUpdateAvatar({
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useGetAllOrdersQuery,useGetRazorpayPublishablekeyQuery, useCreatePaymentIntentMutation ,useCreateOrderMutation} =
  ordersApi;
