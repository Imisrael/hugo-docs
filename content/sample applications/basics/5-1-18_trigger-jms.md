Table of Contents

5.1.18 Trigger (JMS)
====================

Overview
--------

This section covers how to notify an application with JMS using Trigger functions. For an overview of the trigger function, please refer to the [Trigger (rest)](5-1-17_trigger-rest.php) seciton.

Setting the Trigger
-------------------

**List.1 Setting the Trigger**(TriggerJms.java)

// Create Connection
store = gridLogic.createGridStore();

// Create Trigger Settings
TriggerInfo trigger = new TriggerInfo();
trigger.setName("InstrumentLogJMSTrigger");
trigger.setType(Type.JMS);
trigger.setJMSDestinationType("queue");
trigger.setJMSDestinationName("jms/griddb");
trigger.setTargetEvents(EnumSet.of(EventType.PUT));
trigger.setUser("admin");
trigger.setPassword("admin");
trigger.setURI(URI.create("http://127.0.0.1:7676/"));

// Get TimeSeries Container
TimeSeries<InstrumentLog> logTs =
        store.getTimeSeries("weather\_station\_1", InstrumentLog.class);

logTs.createTrigger(trigger);

*   Line 33: Create a new Trigger with the TriggerInfo() class
*   Line 34-41: Set the parameters for the trigger as necessary
*   Line 47: Create the trigger
*   Line 50-53: The a notification will be triggered when a row is updated.

  

Installation of the JMS server
------------------------------

Note: The installation procedure is complicated so please refer to the documentation of your chosen JMS server. The necessary configuration information specific to the sample environment is as follows:

**Table 1 JMS Server Configuration**

Setting Item

Setting Value

Notification URI

http://127.0.0.1:7676/

Destination type

queue

Destination namejms/griddb

The following is the output of the JMS server when above code triggers an event

**List.4 Result**

The execution result of the list second row update
TriggerJms.java the contents of the standard output of the JMS server when you run is as follows.
{
    "Container" : "Weather\_station\_1" , 
    "Event" : "Put" 
}
Gsnode2 . Griddb_default - - \[ 13 / Sep / 2016 10 : 18 : 01 \] "POST / HTTP / 1.1" 200 - 

Source Code
-----------

Complete source code used in this sample can be downloaded from the following.

Download: [trigger-jms.zip](img/trigger-jms.zip)
