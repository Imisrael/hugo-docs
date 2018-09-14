Table of Contents

5.1.15 TimeSeries Container Modification
========================================

Overview
--------

This chapter describes the changing the schema of a TimeSeries container. Changing the index is same as changing the index as with a collection, please refer the [Collection Modification](5-1-11_collection-modify.php) chapter for details on that process.

  

Schema Modification
-------------------

Like you can with Collections, you can add or remove columns after creating a TimeSeriescontainer. Create a new class with the modified columns. The following AnotherInstrumentLog class shows an example of sch a change.

**List.1 Modified class** (AnotherInstrumentLog.java)

package sample.row;

import java.sql.Blob;
import java.util.Date;

import com.toshiba.mwcloud.gs.RowKey;

public class AnotherInstrumentLog {
/ \*\*
\* Timestamp of log
\* /
@RowKey
public Date timestamp;

/ \*\*
\* ID of WeatherStation
\* /
public String weatherStationId;

/ \*\*
\* Temperature of the measurement result
\* /
public float temperture;

/ \*\*
\* Image data obtained by photographing the sky
\* /
public Blob liveImage;

/ \*\*
\* Added field to InstrumentLog
\* /
public String description;
}

*   L.33: The new field added to the `InstrumentLog` class.

While normally `GridStore.putTimeSeries (String, Class)` would be used but with the modified schema, we need to change the pparameters and use `GridStore.putTimeSeries (String, Class, TimeSeriesProperties, boolean)` method.

**List.2 putTimeSeries Parameters**

≪ R > TimeSeries < R > putTimeSeries (java.lang.String name,
                              java.lang.Class < R > rowType,
                              TimeSeriesProperties props,
                              boolean modifiable)
                              throws GSException

The descriptions of each parameter are the same as when used with collections, please refer to the [modifying collections](5-1-11_collection-modify.php) chapter for more details.

**List 3.Creating a TimeSeries Container with the new Column** (TimeSeriesModify.java)

// Modify another schema TimeSeries Container
TimeSeriesProperties timeProp=new TimeSeriesProperties ();
TimeSeries < AnotherInstrumentLog > anotherTs=store.putTimeSeries("weather\_station\_1",
	AnotherInstrumentLog.class, timeProp, true ); 

*   L.37: In order to use the `putTimeSeries (String, Class, TimeSeriesProperties, boolean)` method with the new class, you have to create a new instance of TimeSeriesProperties. See the [meta-information](/en/docs/documents/5-1-22_metainfo.php) section for more information about TimeSeriesProperties.
*   L.39: Specify `true` for the `modifiable` parameter.

  

Complete source code
--------------------

Complete source code used in this sample can be downloaded from the following.

Download: [timeseries-modify.zip](img/timeseries-modify.zip)
