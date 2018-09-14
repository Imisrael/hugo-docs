Table of Contents

5.1.17 Trigger (REST)
=====================

Overview
--------

This chapter describes how to notify events by REST method in trigger function.

Trigger function
----------------

A trigger function is an automatic notification function when an operation (add/update or delete) is carried out on the row data of a container. Event notifications can be received without the need to poll and monitor the database by application.

There are 2 ways of notifying events to the application.

*   REST
*   Java Messaging Service (JMS)

Here we describe how to notify the events by REST method.

Setting the Trigger
-------------------

Following information should be set to notify events by REST method.

**Table.1 Trigger settings (REST)**

  

Item

Description

Name

Trigger name.

Trigger type

`TriggerInfo.Type.REST`

Notification condition

`TriggerInfo.EventType.PUT` or `TriggerInfo.EventType.DELETE`

Notification destination URI

It should be described in the following format. (method name)://(host name):(port number)/(path)

**List.1 Setting the Trigger** (TriggerRest.java)

// Create Trigger Settings
TriggerInfo trigger = new TriggerInfo();
trigger.setName("InstrumentLogRESTTrigger");
trigger.setType(Type.REST);
trigger.setTargetEvents(EnumSet.of(EventType.PUT));
trigger.setURI(URI.create("http://127.0.0.1/api"));

// Get TimeSeries Container
TimeSeries<InstrumentLog> logTs =
        store.getTimeSeries("weather\_station\_1", InstrumentLog.class);

logTs.createTrigger(trigger);

// Update Data for call Trigger
SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH:mm", Locale.US);
InstrumentLog log = logTs.get(format.parse("2016/07/02 12:00"));
log.temperture = 90;
ogTs.put(log);

*   L.33: Instantiate the `TriggerInfo` which represents the trigger setting.
*   L.34−37: Set trigger properties in Table.1
*   L.43: Set `TriggerInfo` into Timeseries Container. Not only Timeseries Container, but also Collection could be used for trigger function.
*   L.46-49: Update the Timeseries Container to enable trigger notification.

  

REST server startup
-------------------

You need to prepare the REST server to receive notifications. In this sample, we will show you how to run the simple Web server in Python which can be used to display the logs.

  
**List.2 REST Server Script** (restserver.py)

import sys
import json
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

class JsonResponseHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        content_len = int(self.headers.get('content-length'))
        body = self.rfile.read(content_len).decode('UTF-8')
        jsonBody = json.loads(body)
        print(json.dumps(jsonBody, indent=4))
        self.send_response(200)
        self.send_header('Content-type', 'text/json')
        self.end_headers()

server = HTTPServer(('', 80), JsonResponseHandler)
server.serve_forever()

This REST server can be run by executing the command below.

**List.3 Run REST Server Script**

$ sudo python restserver.py

Please note that you should run the REST server on the machine which represents notification destination URI.

Result of the Trigger execution
-------------------------------

You can see the result below on REST server when `TriggerRest.java` is executed.

**List.4 Result of Update the Row**

{
    "container": "weather\_station\_1",
    "event": "put"
}
gsnode2.griddb_default - - \[13/Sep/2016 10:18:01\] "POST /api HTTP/1.1" 200 -

In this case, Container `weather_station_1` exists in `gsnode2.griddb_default` and you can see the the notification content.

Source Code
-----------

Complete source code used in this sample can be downloaded from the following.

Download: [trigger-rest.zip](img/trigger-rest.zip)
