import { addWishlist, removeWhislist } from "../controllers/whislistController";
import authUser from "../middleware/auth";

const whislistRouter = express.Router();

whislistRouter.post("/add", authUser, addWishlist);
whislistRouter.post("/remove", authUser, removeWhislist);

export default whislistRouter;
