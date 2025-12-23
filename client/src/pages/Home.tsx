import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, ShieldCheck, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/20"></div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Leading Healthcare Provider
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-[1.1] mb-6">
              Your Health, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Our Priority</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Experience world-class healthcare with our team of expert doctors. 
              Advanced technology, compassionate care, and seamless appointment booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/doctors">
                <Button size="lg" className="rounded-full text-base px-8 h-12 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all">
                  Book Appointment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="rounded-full text-base px-8 h-12 border-2 hover:bg-muted/50">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-[3rem] blur-3xl -z-10"></div>
            {/* professional doctor happy with clipboard */}
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" 
              alt="Medical Team" 
              className="rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-gray-800 w-full object-cover aspect-[4/3]"
            />
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">24/7 Support</p>
                <p className="text-xs text-muted-foreground">Emergency care</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">We provide comprehensive healthcare services with a focus on patient comfort and recovery.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Expert Doctors", desc: "Board-certified specialists with years of experience.", icon: CheckCircle2 },
            { title: "Modern Technology", desc: "State-of-the-art diagnostic and treatment equipment.", icon: ShieldCheck },
            { title: "Patient-Centric", desc: "Personalized care plans tailored to your specific needs.", icon: HeartPulse },
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-primary">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
