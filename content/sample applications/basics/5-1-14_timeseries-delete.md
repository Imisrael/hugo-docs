Table of Contents

5.1.14 TimeSeries Data Deletion
===============================

Overview
--------

This section describes deleting data in a TimeSeries container.

  

Data deletion
-------------

To delete the data (row) in a TimeSeries container, specify the timestamp of the rows you want to delete.

**List.1 Delete TimeSeries Data** (TimeSeriesDeleteRow.java)

SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH:mm", Locale.US);

String containerName = "weather\_station\_1";
// Get TimeSeries Container
TimeSeries<InstrumentLog> logTs =
        store.getTimeSeries(containerName, InstrumentLog.class);
Date deleteTime = format.parse("2016/07/02 12:00");

System.out.println(containerName + " ################");
System.out.println("Timestamp\\t\\t\\tWeatherStation ID\\tTemperture");

// Delete the Instrument log of the specified time
boolean deleteSuccessed = logTs.remove(deleteTime);
System.out.println("Delete Result:" + deleteSuccessed);

InstrumentLog log = logTs.get(format.parse("2016/07/02 12:00"));
if (log == null) {
    System.out.println("Deleted log at 2016/07/02 12:00");
}

*   L.41: Specify the timestamps of the data to remove using the `TimeSeries.remove(Date)` method. Here the time stamp is `2016/07/02 12:00`. If the deletion is successful, it will return is true.

  
Execution results are as follows.

**List.2 Result**

Delete Result: true
Deleted log at 2016/07/02 12:00

You can check that the specified data has been deleted.

Complete source code
--------------------

Complete source code used in this sample can be downloaded from the following.

Download: [timeseries-delete.zip](img/timeseries-delete.zip)
