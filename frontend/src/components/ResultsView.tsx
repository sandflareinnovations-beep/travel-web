import { Plane, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ResultsView = () => {
    return (
        <section className="container mx-auto py-8">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold font-heading">Search Results</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Filter by Airline</Button>
                        <Button variant="outline" size="sm">Sort by Price</Button>
                    </div>
                </div>

                {/* Flight Card Example */}
                <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row overflow-hidden group">
                    <div className="p-6 md:w-1/4 border-b md:border-b-0 md:border-r bg-muted/20 flex flex-col justify-center group-hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-white rounded-full border flex items-center justify-center text-primary font-bold shadow-sm">EK</div>
                            <div>
                                <h3 className="font-semibold text-lg">Emirates</h3>
                                <p className="text-xs text-muted-foreground font-medium">EK501 • A380</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 md:w-1/2 flex items-center justify-between gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">10:00</div>
                            <div className="text-sm font-medium text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">DXB</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center px-4">
                            <span className="text-xs font-semibold text-muted-foreground mb-2">4h 30m</span>
                            <div className="w-full h-[2px] bg-slate-200 relative">
                                <div className="absolute left-0 -top-[3px] h-2 w-2 rounded-full border-2 border-slate-300 bg-white"></div>
                                <div className="absolute right-0 -top-[3px] h-2 w-2 rounded-full border-2 border-slate-300 bg-white"></div>
                                <div className="absolute top-0 bottom-0 left-0 right-0 bg-primary/20 origin-left transform scale-x-0 transition-transform group-hover:scale-x-100 duration-1000"></div>
                            </div>
                            <span className="text-xs text-emerald-600 font-medium mt-2">Non-stop</span>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">14:30</div>
                            <div className="text-sm font-medium text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">LHR</div>
                        </div>
                    </div>
                    <div className="p-6 md:w-1/4 bg-slate-50 flex flex-col items-end justify-center border-t md:border-t-0 md:border-l">
                        <div className="text-3xl font-bold text-primary mb-1">$450</div>
                        <div className="text-xs text-muted-foreground mb-4 font-medium">+ $45 Taxes</div>
                        <Button size="lg" className="w-full font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">Book Now</Button>
                        <p className="text-[10px] text-emerald-600 mt-2 font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3" /> 9 Seats Left</p>
                    </div>
                </div>

                {/* Another Card */}
                <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row overflow-hidden group">
                    <div className="p-6 md:w-1/4 border-b md:border-b-0 md:border-r bg-muted/20 flex flex-col justify-center group-hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-white rounded-full border flex items-center justify-center text-primary font-bold shadow-sm">BA</div>
                            <div>
                                <h3 className="font-semibold text-lg">British Airways</h3>
                                <p className="text-xs text-muted-foreground font-medium">BA105 • B777</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 md:w-1/2 flex items-center justify-between gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">11:15</div>
                            <div className="text-sm font-medium text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">DXB</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center px-4">
                            <span className="text-xs font-semibold text-muted-foreground mb-2">6h 15m</span>
                            <div className="w-full h-[2px] bg-slate-200 relative">
                                <div className="absolute left-0 -top-[3px] h-2 w-2 rounded-full border-2 border-slate-300 bg-white"></div>
                                <div className="absolute right-0 -top-[3px] h-2 w-2 rounded-full border-2 border-slate-300 bg-white"></div>
                                <div className="absolute left-1/2 -top-[3px] h-2 w-2 rounded-full border-2 border-slate-300 bg-slate-100"></div>
                            </div>
                            <span className="text-xs text-amber-600 font-medium mt-2">1 Stop (FRA)</span>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">16:30</div>
                            <div className="text-sm font-medium text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">LHR</div>
                        </div>
                    </div>
                    <div className="p-6 md:w-1/4 bg-slate-50 flex flex-col items-end justify-center border-t md:border-t-0 md:border-l">
                        <div className="text-3xl font-bold text-primary mb-1">$420</div>
                        <div className="text-xs text-muted-foreground mb-4 font-medium">+ $40 Taxes</div>
                        <Button size="lg" className="w-full font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">Book Now</Button>
                        <p className="text-[10px] text-emerald-600 mt-2 font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3" /> 5 Seats Left</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResultsView;
