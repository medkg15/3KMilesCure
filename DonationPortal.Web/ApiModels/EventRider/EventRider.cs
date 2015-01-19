﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DonationPortal.Web.ApiModels.EventRider
{
	public class EventRider
	{
		public int EventRiderID { get; set; }
		public string Name { get; set; }
		public string UrlSlug { get; set; }
		public float MapLatitude { get; set; }
		public float MapLongitude { get; set; }
		public int MapZoom { get; set; }
		public float MarkerLatitude { get; set; }
		public float MarkerLongitude { get; set; }
	}
}