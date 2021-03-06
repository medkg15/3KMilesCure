//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DonationPortal.Engine
{
    using System;
    using System.Collections.Generic;
    
    public partial class Route
    {
        public Route()
        {
            this.RouteVertexes = new HashSet<RouteVertex>();
            this.EventRiders = new HashSet<EventRider>();
        }
    
        public int RouteID { get; set; }
        public string Color { get; set; }
        public string Name { get; set; }
        public string UrlSlug { get; set; }
        public bool Circular { get; set; }
    
        public virtual ICollection<RouteVertex> RouteVertexes { get; set; }
        public virtual ICollection<EventRider> EventRiders { get; set; }
    }
}
