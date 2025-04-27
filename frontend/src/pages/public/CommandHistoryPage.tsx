import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Database } from 'lucide-react';
import { format } from 'date-fns';
import { apiGetHistory } from '@/apis/history'
import { CommandHistoryItem } from '@/types/history'


const CommandHistoryPage = () => {
  const [historyData, setHistoryData] = useState<CommandHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiGetHistory();
        if (response.data.status === "success") {
          setHistoryData(response.data.data);
        } else {
          setError("Failed to fetch history data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Success
          </Badge>
        );
      case 'error':
      case 'failure':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <AlertCircle className="mr-1 h-3 w-3" /> Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch (err) {
      return timestamp;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Database className="mr-2" /> Command History
          </CardTitle>
          <CardDescription>
            View the history of all commands executed in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading history...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
              <AlertCircle className="inline-block mr-2" />
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Device Name</TableHead>
                    <TableHead>Device Type</TableHead>
                    <TableHead>Plant</TableHead>
                    <TableHead>Plant Location</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.length > 0 ? (
                    historyData.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">
                          {item.action}
                        </TableCell>
                        <TableCell>
                          {item.actiondevice?.name || <span className="text-gray-400">N/A</span>}
                        </TableCell>
                        <TableCell>
                          {item.actiondevice?.devicetype || <span className="text-gray-400">N/A</span>}
                        </TableCell>
                        <TableCell>
                          {item.plantId?.type || <span className="text-gray-400">N/A</span>}
                        </TableCell>
                        <TableCell>
                          {item.plantId?.location || <span className="text-gray-400">N/A</span>}
                        </TableCell>
                        <TableCell>{formatTimestamp(item.timeaction)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No command history found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CommandHistoryPage