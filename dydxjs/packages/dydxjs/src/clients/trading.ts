import { sign } from "crypto";
import {
  Order,
  Order_ConditionType,
  Order_Side,
  Order_TimeInForce,
  OrderId,
} from "../dydxprotocol/clob/order";
import { MsgPlaceOrder } from "../dydxprotocol/clob/tx";
import { dydxprotocol } from "../dydxprotocol/bundle";
import { getSigningDydxprotocolClient } from "../dydxprotocol/client";

const { placeOrder, cancelOrder } =
  dydxprotocol.clob.MessageComposer.withTypeUrl;

export const createOrder = ({
  orderId,
  side,
  quantums,
  subticks,
  goodTilBlock,
  goodTilBlockTime,
  timeInForce,
  reduceOnly,
  clientMetadata,
  conditionType,
  conditionalOrderTriggerSubticks,
}: {
  orderId: OrderId;
  side: Order_Side;
  quantums: bigint;
  subticks: bigint;
  goodTilBlock?: number;
  goodTilBlockTime?: number;
  timeInForce: Order_TimeInForce;
  reduceOnly: boolean;
  clientMetadata: number;
  conditionType: Order_ConditionType;
  conditionalOrderTriggerSubticks: bigint;
}) => {
  const msg = placeOrder({
    order: {
      orderId,
      side,
      quantums,
      subticks,
      goodTilBlock,
      goodTilBlockTime,
      timeInForce,
      reduceOnly,
      clientMetadata,
      conditionType,
      conditionalOrderTriggerSubticks,
    },
  });
};
