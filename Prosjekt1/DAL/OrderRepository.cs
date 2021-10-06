using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cruisaholic.Models;

namespace Cruisaholic.DAL
{
    public class OrderRepository : IOrderRepository
    {

        private readonly OrderContext _orderDB;


        public OrderRepository(OrderContext orderDB)
        {
            _orderDB = orderDB;

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
                    ArrivalDate = newOrder.ArrivalDate,

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
                    ArrivalDate = newOrder.ArrivalDate,

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
    }
}

