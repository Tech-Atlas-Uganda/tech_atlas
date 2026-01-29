import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Calendar, Briefcase, Users, Globe, Github, Twitter, Linkedin } from "lucide-react";

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  item: any;
  type: 'hub' | 'community' | 'startup' | 'job' | 'gig' | 'event' | 'opportunity' | 'resource' | 'blog';
}

export default function DetailModal({ open, onClose, item, type }: DetailModalProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{item.name || item.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          {item.description && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">About</h3>
              <p className="text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* Location */}
          {item.location && (
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>{item.location}</span>
            </div>
          )}

          {/* Focus Areas / Skills / Tags */}
          {(item.focusAreas || item.skills || item.tags) && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {type === 'job' || type === 'gig' ? 'Required Skills' : 'Focus Areas'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(item.focusAreas) ? item.focusAreas : 
                  Array.isArray(item.skills) ? item.skills :
                  Array.isArray(item.tags) ? item.tags : []).map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Job/Gig specific fields */}
          {(type === 'job' || type === 'gig') && (
            <div className="grid grid-cols-2 gap-4">
              {item.type && (
                <div>
                  <span className="text-slate-400 text-sm">Type</span>
                  <p className="text-white font-medium">{item.type}</p>
                </div>
              )}
              {item.experienceLevel && (
                <div>
                  <span className="text-slate-400 text-sm">Experience</span>
                  <p className="text-white font-medium capitalize">{item.experienceLevel}</p>
                </div>
              )}
              {item.salaryMin && item.salaryMax && (
                <div>
                  <span className="text-slate-400 text-sm">Salary Range</span>
                  <p className="text-white font-medium">
                    ${item.salaryMin.toLocaleString()} - ${item.salaryMax.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Event specific fields */}
          {type === 'event' && (
            <div className="space-y-3">
              {item.date && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>{new Date(item.date).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}</span>
                </div>
              )}
              {item.eventType && (
                <div>
                  <span className="text-slate-400 text-sm">Event Type</span>
                  <p className="text-white font-medium capitalize">{item.eventType}</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Info */}
          {(item.contactEmail || item.contactPhone) && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Contact</h3>
              <div className="space-y-1">
                {item.contactEmail && (
                  <p className="text-slate-300">Email: {item.contactEmail}</p>
                )}
                {item.contactPhone && (
                  <p className="text-slate-300">Phone: {item.contactPhone}</p>
                )}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="flex flex-wrap gap-3">
            {item.website && (
              <Button variant="outline" size="sm" asChild className="border-blue-500/20 hover:bg-blue-500/10">
                <a href={item.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </a>
              </Button>
            )}
            {item.externalLink && (
              <Button variant="outline" size="sm" asChild className="border-blue-500/20 hover:bg-blue-500/10">
                <a href={item.externalLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Learn More
                </a>
              </Button>
            )}
            {item.applyLink && (
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
                <a href={item.applyLink} target="_blank" rel="noopener noreferrer">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Apply Now
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
