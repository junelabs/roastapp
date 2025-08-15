import ReviewForm from '../../../Components/ReviewForm';

export default function DevReviewPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Review Dev Roastery</h1>
      <ReviewForm
        roasterId="dev-roaster-1"
        roasterSlug="dev"
        roasterName="Dev Roastery"
        coffeeOptions={['House Espresso', 'Seasonal Filter']}
      />
    </main>
  );
}
