import { Room } from "./Room";

export interface RoomState {
    list: Room[];
    loading: boolean;
    error?: string | null;
  }