import { Message } from "./Message";
import { Messagegrp } from "./Messagegrp";



export interface MessageState {
    list: Message[];
    listgrp: Messagegrp[];
    loading: boolean;
    error: string | null;
  }
  