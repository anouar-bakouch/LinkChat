import { getConnecterUser, triggerNotConnected } from "../lib/session.js";
import PushNotifications from '@pusher/push-notifications-server';

export default async (req, res) => {
    console.log("Initializing Beams");
    const userIDInQueryParam = req.query["user_id"];
    const user = await getConnecterUser(req);
    if (!user || userIDInQueryParam !== user.externalId) {
        triggerNotConnected(res);
        return;
    }

    console.log("Using push instance:", process.env.PUSHER_BEAMS_INSTANCE_ID);
    const beamsClient = new PushNotifications({
        instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID,
        secretKey: process.env.PUSHER_BEAMS_SECRET_KEY,
    });

    const beamsToken = await beamsClient.generateToken(userIDInQueryParam);
    res.json(beamsToken);

    console.log("Beams initialized");
    
};