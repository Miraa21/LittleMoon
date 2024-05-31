from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Order, OrderItem, Product, ShippingAddress
from base.serializers import ProductSerializer,OrderSerializer
from rest_framework import status
from datetime import datetime
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data.get('orderItems', None)  
    if orderItems is None or len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        try:
            order = Order.objects.create(
                user=user,
                paymentMethod=data['paymentMethod'],
                taxPrice=data.get('taxPrice', 0),
                shippingPrice=data.get('shippingPrice', 0),
                totalPrice=data.get('totalPrice', 0),
            )
            shipping_address_data = data.get('shippingAddress',None)  # Get the shippingAddress dictionary or an empty dictionary if missing
            notes = shipping_address_data.get('notes', None)  # Get the value of 'notes' or None if missing

            shipping = ShippingAddress.objects.create(
                order=order,
                address=shipping_address_data.get('address', None),
                city=shipping_address_data.get('city', None),
                country=shipping_address_data.get('country', None),
                notes=notes,
)

            for i in orderItems:
                product = Product.objects.get(_id=i['product'])

                item = OrderItem.objects.create(
                    product=product,
                    order=order,
                    name=product.name,
                    qty=i['qty'],
                    price=i['price'],
                    image=product.image.url,
                )

                product.stock -= int(item.qty)
                product.save()

            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getmyOrders(request):
    user=request.user
    orders=user.order_set.all()
    serializer=OrderSerializer(orders,many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_403_FORBIDDEN)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])   
def updateOrderToPaid(request,pk):
    order=Order.objects.get(_id=pk)
    order.isPaid=True
    order.paidAt= datetime.now()
    order.save()
    return Response('Order was paid')

@api_view(['PUT'])
@permission_classes([IsAdminUser,IsAuthenticated])   
def updateOrderToDelivered(request,pk):
    order=Order.objects.get(_id=pk)
    order.isDelivered=True
    order.deliveredAt= datetime.now()
    order.save()
    return Response('Order was delivered')

@api_view(['GET'])
@permission_classes([IsAdminUser,IsAuthenticated])
def getOrders(request):
    orders=Order.objects.all()
    serializer=OrderSerializer(orders,many=True)
    return Response(serializer.data)
