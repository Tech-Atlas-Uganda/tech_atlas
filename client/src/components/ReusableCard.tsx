import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Calendar, User, Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface ReusableCardProps {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  location?: string;
  date?: string;
  author?: string;
  company?: string;
  url?: string;
  featured?: boolean;
  type?: "job" | "event" | "resource" | "blog" | "community" | "startup";
  index?: number;
  onClick?: () => void;
}

export function ReusableCard({
  title,
  description,
  category,
  tags = [],
  location,
  date,
  author,
  company,
  url,
  featured = false,
  type = "resource",
  index = 0,
  onClick
}: ReusableCardProps) {
  const getTypeColor = () => {
    switch (type) {
      case "job": return "from-green-500 to-emerald-500";
      case "event": return "from-orange-500 to-red-500";
      case "resource": return "from-blue-500 to-cyan-500";
      case "blog": return "from-purple-500 to-pink-500";
      case "community": return "from-indigo-500 to-purple-500";
      case "startup": return "from-pink-500 to-rose-500";
      default: return "from-blue-500 to-cyan-500";
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "job": return Building2;
      case "event": return Calendar;
      case "community": return User;
      default: return ExternalLink;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card 
        className="h-full hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col cursor-pointer group"
        onClick={onClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-lg flex-1 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            {featured && (
              <Badge className={`bg-gradient-to-r ${getTypeColor()} ml-2`}>
                Featured
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {category && (
              <Badge variant="secondary">{category}</Badge>
            )}
            {type && (
              <Badge variant="outline" className="capitalize">{type}</Badge>
            )}
          </div>

          {description && (
            <CardDescription className="line-clamp-3">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <div className="space-y-3 mb-4">
            {location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </div>
            )}
            
            {date && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(date).toLocaleDateString()}
              </div>
            )}
            
            {(author || company) && (
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-3 w-3 mr-1" />
                {author || company}
              </div>
            )}
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {url && (
            <Button asChild className="w-full mt-auto" variant="outline">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <TypeIcon className="h-4 w-4" />
                View Details
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}