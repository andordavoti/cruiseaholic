using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cruiseaholic.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using System.Linq;
using System;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;

namespace Cruiseaholic.DAL
{
    [ExcludeFromCodeCoverage]
    public class OrderRepository : IOrderRepository
    {

        private readonly OrderContext _orderDB;

        private readonly ILogger<OrderRepository> _orderLog;


        public OrderRepository(OrderContext orderDB, ILogger<OrderRepository> orderLog)
        {
            _orderDB = orderDB;
            _orderLog = orderLog;

        }

        [HttpPost]
        public async Task<string> NewOrder([FromBody] CustomerOrder newOrder)
        {
            Customer existingCustomer;

            var route = await _orderDB.Route.SingleAsync(route => route.ToDestination.Equals(newOrder.ToDestination) && route.FromDestination.Equals(newOrder.FromDestination));

            try
            {
                existingCustomer = await _orderDB.Customer.SingleAsync(customer => customer.Email.Equals(newOrder.Email));
            }
            catch
            {
                existingCustomer = null;
            }

            if (existingCustomer != null)
            {
                existingCustomer.FirstName = newOrder.FirstName;
                existingCustomer.LastName = newOrder.LastName;
                existingCustomer.PhoneNumber = newOrder.PhoneNumber;

                var order = new Order()
                {
                    NumberOfAdults = newOrder.NumberOfAdults,
                    NumberOfChildren = newOrder.NumberOfChildren,
                    NumberOfVehicles = newOrder.NumberOfVehicles,

                    IsRoundtrip = newOrder.IsRoundtrip,
                    DepartureDate = newOrder.DepartureDate,
                    ReturnDate = newOrder.ReturnDate,

                    CardNumber = newOrder.CardNumber,
                    CardholderName = newOrder.CardholderName,
                    CVC = newOrder.CVC,
                    Expiry = newOrder.Expiry,

                    Customer = existingCustomer,
                    Route = route,
                };

                existingCustomer.Orders.Add(order);
                await _orderDB.SaveChangesAsync();
                return existingCustomer.Email;
            }
            else
            {
                var customer = new Customer()
                {
                    FirstName = newOrder.FirstName,
                    LastName = newOrder.LastName,
                    Email = newOrder.Email,
                    PhoneNumber = newOrder.PhoneNumber,
                };

                var order = new Order()
                {
                    NumberOfAdults = newOrder.NumberOfAdults,
                    NumberOfChildren = newOrder.NumberOfChildren,
                    NumberOfVehicles = newOrder.NumberOfVehicles,

                    IsRoundtrip = newOrder.IsRoundtrip,
                    DepartureDate = newOrder.DepartureDate,
                    ReturnDate = newOrder.ReturnDate,

                    CardNumber = newOrder.CardNumber,
                    CardholderName = newOrder.CardholderName,
                    CVC = newOrder.CVC,
                    Expiry = newOrder.Expiry,

                    Customer = customer,
                    Route = route,
                };

                _orderDB.Add(order);
                await _orderDB.SaveChangesAsync();
                return order.Customer.Email;
            }
        }

        public async Task<Customer> GetCustomerInfo(string email)
        {
            try
            {
                var customerInfo = await _orderDB.Customer.SingleAsync(customer => customer.Email == email);
                return customerInfo;
            }
            catch
            {
                return null;
            }
        }

        public async Task<List<Route>> GetRoutes()
        {
            try
            {
                var routes = await _orderDB.Route.ToListAsync();
                return routes;
            }
            catch
            {
                return null;
            }
        }

        public async Task<List<Route>> AddRoute([FromBody] Route route)
        {
            try
            {
                _orderDB.Route.Add(route);
                await _orderDB.SaveChangesAsync();
                var routes = await _orderDB.Route.ToListAsync();
                return routes;
            }
            catch
            {
                return null;
            }
        }

        public async Task<List<Route>> ChangeRoute([FromBody] Route route)
        {
            try
            {
                Route routeToChange = await _orderDB.Route.FindAsync(route.Id);
                routeToChange.FromDestination = route.FromDestination;
                routeToChange.ToDestination = route.ToDestination;
                routeToChange.PriceChildren = route.PriceChildren;
                routeToChange.PriceAdults = route.PriceAdults;
                routeToChange.PriceVehicle = route.PriceVehicle;

                await _orderDB.SaveChangesAsync();
                var routes = await _orderDB.Route.ToListAsync();
                return routes;
            }
            catch
            {
                return null;
            }
        }

        public async Task<List<Route>> RemoveRoute(int id)
        {
            try
            {
                Route routeToRemove = await _orderDB.Route.FindAsync(id);
                _orderDB.Route.Remove(routeToRemove);
                await _orderDB.SaveChangesAsync();
                var routes = await _orderDB.Route.ToListAsync();
                return routes;
            }
            catch
            {
                return null;
            }
        }

        public static byte[] CreateHash(string password, byte[] salt)
        {
            return KeyDerivation.Pbkdf2(
                                password: password,
                                salt: salt,
                                prf: KeyDerivationPrf.HMACSHA512,
                                iterationCount: 1000,
                                numBytesRequested: 32);
        }

        public static byte[] CreateSalt()
        {
            var csp = new RNGCryptoServiceProvider();
            var salt = new byte[24];
            csp.GetBytes(salt);
            return salt;
        }

        public async Task<bool> Login(User user)
        {
            try
            {
                DBUser userFromDB = await _orderDB.User.FirstOrDefaultAsync(u => u.Username == user.Username);
                byte[] hash = CreateHash(user.Password, userFromDB.Salt);
                bool ok = hash.SequenceEqual(userFromDB.Password);
                return ok;
            }
            catch (Exception err)
            {
                _orderLog.LogInformation(err.Message);
                return false;
            }
        }
    }
}

