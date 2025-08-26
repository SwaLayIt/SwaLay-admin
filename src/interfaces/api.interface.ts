// export interface AnalyticsResponse {
//   userTypeCount: {
//     normal: number;
//     super: number;
//   };
//   verifiedCount: number;
//   activeCount: number;
//   statesCount: {
//     state: string;
//     count: number;
//     active: number;
//     expired: number;
//     cancelled: number;
//   }[];
//   topPlan: {
//     planName: string;
//     count: number;
//   } | null;
//   topPlans: {
//     planName: string;
//     count: number;
//   }[];
//   userCountBySubscription: {
//     normal: {
//       planName: string;
//       status: "active" | "expired" | "cancelled";
//       count: number;
//     }[];
//     super: {
//       planName: string;
//       status: "active" | "expired" | "cancelled";
//       count: number;
//     }[];
//   };
//   subscriptionStatusTotals: {
//     active: number;
//     expired: number;
//     cancelled: number;
//   };
// }


export interface ApiResponse<T=unknown>{
  success : boolean
  status : number
  message : string
  data? : T
  error? : string
}
