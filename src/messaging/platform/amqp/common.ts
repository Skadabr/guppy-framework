/// <reference path="./amqplib.d.ts" />

/** @internal */
import * as amqplib from "amqplib";

/** @internal */
export type NativeConnection = amqplib.Connection;

/** @internal */
export type NativeSession = amqplib.Channel;

/** @internal */
export type Exchange = amqplib.Exchange;

/** @internal */
export type NativeQueue = amqplib.Queue;

/** @internal */
export type NativeMessage = amqplib.Message;