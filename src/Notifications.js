import React, { useEffect } from 'react';
import { Client, TokenProvider } from "@pusher/push-notifications-web";

console.log("Notifications component loaded");

const beamsClient = new Client({
    instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID,
});

const Notifications = ({ children }) => {
    useEffect(() => {
        const initializePushNotifications = async () => {
            const token = sessionStorage.getItem('token');
            const userExternalId = sessionStorage.getItem('externalId');

            if (!token || !userExternalId) {
                console.warn("Token or userExternalId is missing");
                return;
            }

            if (!beamsClient) {
                console.warn("Beams client is not initialized");
                return;
            }
            

            const beamsTokenProvider = new TokenProvider({
                url: "/api/beams",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            try {
                await beamsClient.start();
                await beamsClient.addDeviceInterest('global'); 
                console.log("Beams token provider initialized", beamsTokenProvider);
                await beamsClient.setUserId(userExternalId, beamsTokenProvider);
                const deviceId = await beamsClient.getDeviceId();
                console.log("Device ID:", deviceId);
            } catch (error) {
                console.error("Push notifications initialization error:", error);
            }
        };

        initializePushNotifications();
    }, []);

    return <>{children}</>;
};

export default Notifications;