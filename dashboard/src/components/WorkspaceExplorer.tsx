import { useState, useEffect } from 'react';
import { Folder, File, Search, Eye, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FileInfo {
  name: string;
  size: number;
  updatedAt: string;
}

export default function WorkspaceExplorer() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<{name: string, content: string} | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (err) {
      console.error("File fetch failed", err);
    }
  };

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 10000);
    return () => clearInterval(interval);
  }, []);

  const viewFile = async (name: string) => {
    try {
      const res = await fetch(`/api/files/${name}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedFile(data);
        setIsViewerOpen(true);
      }
    } catch (err) {
      console.error("Read file failed", err);
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card className="bg-eth-900 border-eth-700 shadow-eth-lg flex flex-col h-[600px]">
        <CardHeader className="p-4 border-b border-eth-700/50 flex flex-row items-center justify-between space-y-0 bg-eth-900/50">
          <div className="flex items-center gap-2">
            <Folder className="text-eth-accent" size={18} />
            <CardTitle className="text-xs font-bold text-white uppercase tracking-widest">Memory Explorer</CardTitle>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-eth-600" size={14} />
            <Input 
              placeholder="Search Archives..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-[10px] bg-eth-800 border-eth-700 text-eth-300 focus-visible:ring-eth-accent uppercase tracking-tighter"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-auto bg-eth-950">
          <Table>
            <TableHeader className="bg-eth-900/80 backdrop-blur sticky top-0 z-10">
              <TableRow className="border-b border-eth-700/50 hover:bg-transparent">
                <TableHead className="text-eth-600 font-bold uppercase text-[9px] h-10 tracking-[0.2em] pl-6">Identifier</TableHead>
                <TableHead className="text-right text-eth-600 font-bold uppercase text-[9px] h-10 tracking-[0.2em]">Size</TableHead>
                <TableHead className="text-right text-eth-600 font-bold uppercase text-[9px] h-10 tracking-[0.2em]">Last Sync</TableHead>
                <TableHead className="text-center text-eth-600 font-bold uppercase text-[9px] h-10 tracking-[0.2em] pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.name} className="border-b border-eth-700/30 hover:bg-eth-800/40 group transition-colors">
                  <TableCell className="py-3 pl-6">
                    <div className="flex items-center gap-3">
                      <File className="text-eth-500 group-hover:text-eth-accent transition-colors" size={14} />
                      <span className="text-eth-300 font-mono text-[11px] group-hover:text-white">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-eth-600 font-mono text-[10px] py-3">{formatSize(file.size)}</TableCell>
                  <TableCell className="text-right text-eth-600 text-[10px] font-mono py-3 uppercase">
                    {new Date(file.updatedAt).toLocaleDateString([], { month: 'short', day: '2-digit' })}
                  </TableCell>
                  <TableCell className="text-center py-3 pr-6">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => viewFile(file.name)}
                      className="h-7 w-7 text-eth-600 hover:text-eth-accent hover:bg-eth-accent/10 transition-all"
                    >
                      <Eye size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-eth-600 text-[10px] uppercase tracking-widest font-mono">
                    No matching archives found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="p-3 border-t border-eth-700/50 bg-eth-900/50 flex items-center justify-between text-[9px] text-eth-600 font-mono uppercase tracking-widest">
          <span>ROOT: /memory/*</span>
          <span>{filteredFiles.length} ARCHIVES LOADED</span>
        </CardFooter>
      </Card>

      {/* TACTICAL FILE VIEWER */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-eth-900 border-eth-700 text-white overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 border-b border-eth-700 bg-eth-900/80 backdrop-blur shrink-0 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-eth-accent font-mono text-sm tracking-widest uppercase">
                {selectedFile?.name}
              </DialogTitle>
              <p className="text-[10px] text-eth-600 uppercase mt-1">Classification: Level 4 Confidential</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsViewerOpen(false)} className="text-eth-600 hover:text-white">
              <X size={18} />
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-8 font-mono text-[11px] leading-relaxed text-eth-300 bg-eth-950">
            <pre className="whitespace-pre-wrap break-words whitespace-pre-line">
              {selectedFile?.content}
            </pre>
          </div>
          <CardFooter className="p-4 border-t border-eth-700 bg-eth-900/50 shrink-0">
             <Button variant="outline" className="w-full border-eth-700 text-eth-600 hover:text-eth-accent hover:border-eth-accent/50 text-[10px] h-8 font-bold uppercase tracking-widest">
                Export Transcript
             </Button>
          </CardFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
