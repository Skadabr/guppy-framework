/// <reference path="./amqplib.d.ts" />

import * as amqplib from "amqplib";

export type NativeConnection = amqplib.Connection;
export type NativeSession = amqplib.Channel;
export type Exchange = amqplib.Exchange;
export type NativeQueue = amqplib.Queue;
export type NativeMessage = amqplib.Message;