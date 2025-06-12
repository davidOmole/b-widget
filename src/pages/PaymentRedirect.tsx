import { useEffect } from "react";
import { useEventCapture } from "../hooks/useEventCapture";
export const PAYMENT_REDIRECT_EVENT = "Payment Completed";

const PaymentRedirectPage = () => {
     const {registerEvent} = useEventCapture();
	useEffect(() => {
		if (window.self !== window.top) {
			(() => {
				window.parent.postMessage({ type: PAYMENT_REDIRECT_EVENT }, "*");
			})();
		} else {
			(() => {
				const channel = new BroadcastChannel("app-channel");
				channel.postMessage({
					type: PAYMENT_REDIRECT_EVENT,
					message: "Payment tab is closed",
				});
                    registerEvent({
                         event_name: "Payment_tab_closed_bookings",
                         event_data: {
                           event_type: "Event to track when payment tab is closed for bookings",
                         },
                    });
				window.close();
			})();
		}
	}, []);

	return <div></div>;
};

export default PaymentRedirectPage;