// Footer component with links and social media
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">
                What's Happening?
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover local events and connect with your community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/events" className="hover:text-primary transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="hover:text-primary transition-colors">
                  Create Event
                </Link>
              </li>
              {/* <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/events?category=music" className="hover:text-primary transition-colors">
                  Music
                </Link>
              </li>
              <li>
                <Link to="/events?category=food-drink" className="hover:text-primary transition-colors">
                  Food & Drink
                </Link>
              </li>
              <li>
                <Link to="/events?category=sports" className="hover:text-primary transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/events?category=arts" className="hover:text-primary transition-colors">
                  Arts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                missmaggie215@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +254708679439
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} What's Happening? All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
