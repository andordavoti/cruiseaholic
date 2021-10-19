using System.Diagnostics.CodeAnalysis;
using Cruiseaholic.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Cruiseaholic.DAL
{
    [ExcludeFromCodeCoverage]
    public class DBInit
    {
        public static void Init(IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.CreateScope();

            var context = serviceScope.ServiceProvider.GetService<OrderContext>();

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            // Create initial routes
            var route1 = new Route
            {
                FromDestination = "Oslo, Norway",
                ToDestination = "Strømstad, Sweden",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };

            var route2 = new Route
            {
                FromDestination = "Oslo, Norway",
                ToDestination = "Hirtshals, Denmark",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };

            var route3 = new Route
            {
                FromDestination = "Oslo, Norway",
                ToDestination = "Kiel, Germany",
                PriceChildren = 800,
                PriceAdults = 1600,
                PriceVehicle = 500
            };

            var route4 = new Route
            {
                FromDestination = "Strømstad, Sweden",
                ToDestination = "Oslo, Norway",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };

            var route5 = new Route
            {
                FromDestination = "Strømstad, Sweden",
                ToDestination = "Hirtshals, Denmark",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };

            var route6 = new Route
            {
                FromDestination = "Strømstad, Sweden",
                ToDestination = "Kiel, Germany",
                PriceChildren = 800,
                PriceAdults = 1600,
                PriceVehicle = 500
            };

            var route7 = new Route
            {
                FromDestination = "Hirtshals, Denmark",
                ToDestination = "Oslo, Norway",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };

            var route8 = new Route
            {
                FromDestination = "Hirtshals, Denmark",
                ToDestination = "Strømstad, Sweden",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };

            var route9 = new Route
            {
                FromDestination = "Hirtshals, Denmark",
                ToDestination = "Kiel, Germany",
                PriceChildren = 800,
                PriceAdults = 1600,
                PriceVehicle = 500
            };

            var route10 = new Route
            {
                FromDestination = "Kiel, Germany",
                ToDestination = "Oslo, Norway",
                PriceChildren = 800,
                PriceAdults = 1600,
                PriceVehicle = 500
            };


            var route11 = new Route
            {
                FromDestination = "Kiel, Germany",
                ToDestination = "Strømstad, Sweden",
                PriceChildren = 800,
                PriceAdults = 1600,
                PriceVehicle = 500
            };


            var route12 = new Route
            {
                FromDestination = "Kiel, Germany",
                ToDestination = "Hirtshals, Denmark",
                PriceChildren = 800,
                PriceAdults = 1600,
                PriceVehicle = 500
            };

            // Add routes to DB table
            context.Route.Add(route1);
            context.Route.Add(route2);
            context.Route.Add(route3);
            context.Route.Add(route4);
            context.Route.Add(route5);
            context.Route.Add(route6);
            context.Route.Add(route7);
            context.Route.Add(route8);
            context.Route.Add(route9);
            context.Route.Add(route10);
            context.Route.Add(route11);
            context.Route.Add(route12);


            // Create admin user
            var adminUser = new DBUser { Username = "Admin" };
            string password = "Admin123";
            byte[] salt = OrderRepository.CreateSalt();
            byte[] hash = OrderRepository.CreateHash(password, salt);
            adminUser.Password = hash;
            adminUser.Salt = salt;
            context.User.Add(adminUser);

            context.SaveChanges();
        }
    }
}
