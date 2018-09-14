+++
title = "Monitoring & Troubleshooting"
weight = 7
+++

This chapter describes the troubleshooting procedures of GridDB. It contains information on how to resolve problems which occur when constructing and operating a GridDB’s system.

This chapter is written for developers, users and system administrators responsible for GridDB’s operation management.

The following subjects are covered in this chapter.

*   Introduction
*   Verification of the circumstances under which problems occurred: explains how to check the detailed circumstances (log file).
*   Countermeasures to be adopted when problems occur: contains a list of expected problems and their countermeasures.

### Checking the Circumstances Under Which the Problems Occurred

Check the process (action) and error code etc. to see what kind of problem has occurred and the circumstances under which the problem occurred. After checking the circumstances, review/execute the “countermeasures (resolution method)”.

The circumstances can be checked by either checking the process (action) or by checking the error code.

*   Based on the process (action) carried out when the problem occurred and the error notification, select the appropriate “cause” in [Countermeasures to be adopted when a problem occurs](#shoot) and study the countermeasures.
*   Based on the error notification, select the appropriate “symptom” in [Countermeasures to be adopted when a problem occurs](#shoot), check the \[Description\] and “cause” and study the countermeasures.

If the circumstances cannot be narrowed down from the notification error or the process (action) being carried out, check the GridDB status from the log file. See below for the log files such as the event log, client log, etc.

### Checking the Event Log File of a GridDB Server

Check whether an error has occurred and its description from the event log file in the server.

The contents of the latest event log can be checked with the "gs_logs" command.

**\[Example\]**

$ gs_logs -u admin/admin
2015-03-20T10:07:47.219+0900 host01 22962 INFO CHECKPOINT\_SERVICE \[30902:CP\_STATUS\] \[CP\_START\] mode=NORMAL\_CHECKPOINT, backupPath=

The format of the event log file is as follows. Check the server status when an error occurs from the time and other data.

(Date and time) (host name) (thread no.) (log level) (category) \[(error/trace no.): (error/trace no. name)\] (message) < (Detailed data: source code position etc. Only when an error occurs)>

Earlier event log files are output to the event log storage directory (default: "/var/lib/gridstore/log"). File name is gridstore-log taking date (YYYYMMDD) log. A sequential no. is appended if the log taking date is duplicated.

**\[Memo\]**

*   Execute the "gs_logconf" command when checking or changing the output level of the event log.

### Checking the Log File of a Client

If an error is detected in the client program such as an application program etc., check the description of the error which occurred.

In the client program where Java API is used, the client log can be output to a file by setting the log output, including the login library in the class path of the execution environment.

For example, the following log is recorded.

**\[Example\]**

15/03/25 13:07:56 INFO GridStoreLogger.Transaction: Repairing session (context=7c469c48, statement=PUT\_MULTIPLE\_ROWS, 
partition=11, statementId=1, containerId=0, sessionId=1, trialCount=0, transactionStarted=false)
com.toshiba.mwcloud.gs.common.GSStatementException: \[110016:TM\_SESSION\_UUID_UNMATCHED\] Failed to operate session or transaction status
(pId=11, clientId=87a89588-b6e1-4dac-bf42-92fa596b7efb:1, sessionMode=1, txnMode=1, reason=) (address=/192.168.10.10:10001, partitionId=11)

Compare the event log of the server at the time the error was recorded in the client log and check the surrounding logs to verify the status of the server when the error occurred.

**\[Memo\]**

*   An error message may be recorded in the event log if an error were to occur during notification or if the trigger process were to fail.
*   See the paragraph on GridStoreFactory class in the “GridDB API Reference” ([GridDB\_API\_Reference.html](/en/docs/GridDB_API_Reference.html)) for the client login settings.

### Checking the Log File of a JDBC Driver

If an error occurs in the GridDB Advanced Edition NewSQL interface e.g. during SQL execution, check the description of the error.

The log file below is created under the execution directory of the application, or under the log output directory specified by the application.

*   Log file of the JDBC driver is "/NewSQLJDBC.log".
*   Log file of the engine is "/newsql- log taking date and time (YYYYMMDDHHMMSS).log"

A log will not be output by default. If the log file has not been created, set up the log output level and output destination.

The log output level and output destination settings are configured from gs.util.Debug.

(1) Import gs.util.Debug.

(2) Use setLogLevel() to change the output level of the log.

　　setLogLevel (int log level)

There are 4 log output levels as shown below.

*   3: ERROR
*   2: WARNING
*   1: INFO
*   0: DEBUG

When the level is set to low, all logs with a level higher than the level will be output.

(3) Use setLogFilePath() to set the log output destination. Default directory is the current directory.

　　Debug.setLogFilePath(String output directory)

**\[Example\]** When the log output level is debug, and log output destination is under the jdbcLog folder in the current directory

import java.sql.*;
import gs.util.Debug;

// usage: java SampleJDBC (multicastAddress) (port) (clusterName)

public class Sample {
 public static void main(String\[\] args) {
  Debug.setLogFilePath("jdbcLog");
  Debug.setLevel(0)
}

### Checking the Log File of an Operating Command

If an error occurs in the operating tool (gs_admin), check the description of the error which occurred from the log file of the operating command.

Log file of operating command is located at "< log data output destination ("/var/lib/gridstore/log" by default)> / operating command name.log".　  
Example) "operating command name.log" may be gs\_startnode.log or gs\_stopcluster.log, gs_stat.log etc.

**\[Example\]** Log file of gs\_startnode command file name: gs\_startnode.log

2014-10-20 15:25:16,876 \[25444\] \[INFO\] <module>(56) /usr/bin/gs_startnode start.
2014-10-20 15:25:16,877 \[25444\] \[DEBUG\] <module>(105) command: \['/usr/bin/gsserver', '--conf', '/var/lib/gridstore/conf'\]
2014-10-20 15:25:17,889 \[25444\] \[INFO\] <module>(156) wait for starting node. (node=127.0.0.1:10040 waitTime=0)
2014-10-20 15:25:18,905 \[25444\] \[INFO\] <module>(192) /usr/bin/gs_startnode end.

**\[Memo\]**

*   Event log data of the server is also recommended to be checked together with the data of the operating command.

Troubleshooting
---------------

Understand the circumstances based on the error notification from the server or application, or the process (action) being executed etc., then select the appropriate problem from the problem and countermeasure list and study the countermeasures.

### Problems and Countermeasures According to the Circumstances Under Which the Problems Occurred

Expected problems have been classified as follows according to the circumstances under which they occurred and the countermeasures to resolve these problems have been summarized.

*   Problems related to cluster configuration
*   Problems related to cluster expansion, reduction
*   Problems related to client failover
*   Problems related to cluster failure
*   Problems related to recovery processing
*   Problems related to container operation
*   TQL-related problems

#### Problems Related to Cluster Configuration

*   [List of problems related to cluster configuration](img/trouble_guide_troubleList_1.html)

#### Problems Related to Cluster Expansion, Reduction

*   [List of problems related to cluster expansion, reduction](img/trouble_guide_troubleList_2.html)

#### Problems Related to Client Failover

*   [List of problems related to client failover](img/trouble_guide_troubleList_3.html)

#### Problems Related to Cluster Failure

*   [List of problems related to cluster failure](img/trouble_guide_troubleList_4.html)

#### Problems Related to Recovery Processing

*   [List of problems related to recovery processing](img/trouble_guide_troubleList_5.html)

#### Problems Related to Container Operation

*   [List of problems related to container operations](img/trouble_guide_troubleList_6.html)

#### TQL-Related Problems

*   [List of TQL-related problems](img/trouble_guide_troubleList_7.html)

\[Reference\] Compatibility

*   [Compatibility between client and DB](img/trouble_guide_troubleList_8.html)

#### General GridDB problems

This sheet summarizes the list of problems above according to the circumstances under which the problems occurred. If the area of the problem which occurred can be clearly classified, use key words such as the error code etc. to conduct a search.

[List of general GridDB problems (HTML)](img/trouble_guide_troubleList.html)

[List of general GridDB problems (PDF)](img/trouble_guide_troubleList.pdf)

**\[Memo\]**

*   A list of the general GridDB problems which summarizes all the documents on the problems according to the circumstances under which they occurred into a single document.
